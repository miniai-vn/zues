import { Resource } from "@/hooks/data/useResource";

export interface TreeNode extends Resource {
  children?: TreeNode[];
  level: number;
  isExpanded?: boolean;
  parentId?: string | number;
}

export interface TreeState {
  expandedNodes: Set<string | number>;
}

/**
 * Transforms flat resource data into a hierarchical tree structure
 * This is a basic implementation - you can enhance it based on your specific needs
 */
export const transformToTreeData = (
  resources: Resource[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  // For now, we'll create a simple grouping by file type
  // You can modify this logic based on your specific tree structure needs

  const typeGroups: { [key: string]: TreeNode[] } = {};

  // Group resources by type
  resources.forEach((resource) => {
    const type = resource.type || "unknown";
    if (!typeGroups[type]) {
      typeGroups[type] = [];
    }

    typeGroups[type].push({
      ...resource,
      level: 1,
      isExpanded: false,
      parentId: type,
    });
  });

  // Create parent nodes for each type
  const treeData: TreeNode[] = [];

  Object.keys(typeGroups).forEach((type) => {
    const parentId = `type-${type}`;
    const parentNode: TreeNode = {
      id: parentId,
      name: `${type.toUpperCase()} Files (${typeGroups[type].length})`,
      type: type,
      description: `All ${type} files`,
      level: 0,
      isExpanded: expandedNodes.has(parentId),
      children: typeGroups[type],
    };

    treeData.push(parentNode);
  });

  return treeData;
};

/**
 * Alternative transformation: Group by status
 */
export const transformToTreeDataByStatus = (
  resources: Resource[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  const statusGroups: { [key: string]: TreeNode[] } = {};

  resources.forEach((resource) => {
    const status = resource.status || "unknown";
    if (!statusGroups[status]) {
      statusGroups[status] = [];
    }

    statusGroups[status].push({
      ...resource,
      level: 1,
      isExpanded: false,
      parentId: status,
    });
  });

  const treeData: TreeNode[] = [];

  Object.keys(statusGroups).forEach((status) => {
    const parentId = `status-${status}`;
    const parentNode: TreeNode = {
      id: parentId,
      name: `${status.toUpperCase()} (${statusGroups[status].length})`,
      type: "folder",
      description: `All ${status} files`,
      level: 0,
      isExpanded: expandedNodes.has(parentId),
      children: statusGroups[status],
    };

    treeData.push(parentNode);
  });

  return treeData;
};

/**
 * Alternative transformation: Group by date (year/month)
 */
export const transformToTreeDataByDate = (
  resources: Resource[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  const dateGroups: { [key: string]: TreeNode[] } = {};

  resources.forEach((resource) => {
    if (resource.createdAt) {
      const date = new Date(resource.createdAt);
      const yearMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!dateGroups[yearMonth]) {
        dateGroups[yearMonth] = [];
      }

      dateGroups[yearMonth].push({
        ...resource,
        level: 1,
        isExpanded: false,
        parentId: yearMonth,
      });
    }
  });

  const treeData: TreeNode[] = [];

  Object.keys(dateGroups)
    .sort()
    .forEach((yearMonth) => {
      const parentId = `date-${yearMonth}`;
      const [year, month] = yearMonth.split("-");
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1
      ).toLocaleDateString("en-US", { month: "long" });

      const parentNode: TreeNode = {
        id: parentId,
        name: `${monthName} ${year} (${dateGroups[yearMonth].length})`,
        type: "folder",
        description: `Files from ${monthName} ${year}`,
        level: 0,
        isExpanded: expandedNodes.has(parentId),
        children: dateGroups[yearMonth],
      };

      treeData.push(parentNode);
    });

  return treeData;
};

/**
 * Flattens tree data for rendering (shows only visible nodes)
 */
export const flattenTreeData = (nodes: TreeNode[]): TreeNode[] => {
  const result: TreeNode[] = [];

  const traverse = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      result.push(node);
      if (node.isExpanded && node.children) {
        traverse(node.children);
      }
    });
  };

  traverse(nodes);
  return result;
};

/**
 * Toggles the expansion state of a node
 */
export const toggleNodeExpansion = (
  nodes: TreeNode[],
  nodeId: string | number
): TreeNode[] => {
  const updateNode = (nodeList: TreeNode[]): TreeNode[] => {
    return nodeList.map((node) => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: updateNode(node.children) };
      }
      return node;
    });
  };

  return updateNode(nodes);
};
