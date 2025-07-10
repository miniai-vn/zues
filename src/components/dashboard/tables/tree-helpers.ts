import { Resource } from "@/hooks/data/useResource";

export interface TreeNode extends Resource {
  children?: TreeNode[];
  level: number;
  isExpanded?: boolean;
  // parentId is not inherited from Resource, so we define it here as a separate property
  parentId?: number;
}

export interface TreeState {
  expandedNodes: Set<string | number>;
}

/**
 * Alternative transformation: Group by status
 */
export const transformToTreeData = (
  resources: Resource[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  // Recursive function to process resources and their nested resources
  const processResourceRecursively = (
    resource: Resource,
    level: number = 1,
    parentId?: number
  ): TreeNode => {
    const treeNode: TreeNode = {
      ...resource,
      level,
      isExpanded: expandedNodes.has(resource.id || 0),
      parentId,
      children: [],
    };

    // Recursively process nested resources if they exist
    if (resource.resources && resource.resources.length > 0) {
      treeNode.children = resource.resources.map((childResource) =>
        processResourceRecursively(childResource, level + 1, resource.id)
      );
    }
    console.log("Processing resource:", resource.id, "Level:", level);
    return treeNode;
  };

  // Group top-level resources by status
  const newR = resources.map((resource) => {
    // Process the resource and all its nested resources recursively
    const childrens = processResourceRecursively(resource, 1);
    return {
      childrens,
      id: resource.id,
      name: resource.name,
      type: resource.type,
    };
  });
  console.log("New resources structure:", newR);
  // Convert newR to TreeNode[] format
  const treeData: TreeNode[] = newR.map((item) => item.childrens);

  return treeData;
};

/**
 * Flat recursive transformation (no grouping)
 */
export const transformToTreeDataFlat = (
  resources: Resource[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  // Recursive function to process resources and their nested resources
  const processResourceRecursively = (
    resource: Resource,
    level: number = 0,
    parentId?: number
  ): TreeNode => {
    const treeNode: TreeNode = {
      ...resource,
      level,
      isExpanded: expandedNodes.has(resource.id || 0),
      parentId,
      children: [],
    };

    // Recursively process nested resources if they exist
    if (resource.resources && resource.resources.length > 0) {
      treeNode.children = resource.resources.map((childResource) =>
        processResourceRecursively(childResource, level + 1, resource.id)
      );
    }

    return treeNode;
  };

  // Process all top-level resources
  return resources.map((resource) => processResourceRecursively(resource));
};

/**
 * Flattens tree data for rendering (shows only visible nodes)
 */
export const flattenTreeData = (
  nodes: TreeNode[],
  expandedNodes: Set<string | number>
): TreeNode[] => {
  console.log("Flattening tree data with expanded nodes:", expandedNodes);
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

  if (expandedNodes.size > 0) {
    return result.filter((node) => expandedNodes.has(node.id as number));
  }
  console.log("Flattened tree data:", result);
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
