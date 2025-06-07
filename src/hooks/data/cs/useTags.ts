import { axiosInstance } from "@/configs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../use-toast";
import { ApiResponse } from "@/utils";

export enum TagType {
  CUSTOMER = "customer",
  CONVERSATION = "conversation",
}
export interface Tag {
  id?: number;
  name: string;
  shopId?: string;
  color?: string;
  type: TagType;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagQueryParamsDto {
  shopId?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export interface TagBulkDeleteDto {
  ids: number[];
}

export type TagsListResponse = Tag[];

interface UseTagsProps {
  queryParams?: TagQueryParamsDto;
  tagId?: number;
}

const useTags = ({ queryParams = {}, tagId }: UseTagsProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKeyAllTags = ["tags", queryParams];
  const queryKeySingleTag = ["tag", tagId];

  // Get all tags (filtered)
  const {
    data: tags,
    isLoading: isLoadingTags,
    error: fetchTagsError,
    refetch: refetchTags,
  } = useQuery<TagsListResponse, Error>({
    queryKey: queryKeyAllTags,
    queryFn: async () => {
      const response = await axiosInstance.get("/api/tags", {
        params: queryParams,
      });
      return response.data;
    },
    enabled: !tagId, // Only fetch list if not fetching a single tag by ID
  });

  // Get single tag by ID
  const {
    data: tag,
    isLoading: isLoadingTag,
    error: fetchTagError,
    refetch: refetchTag,
  } = useQuery<Tag, Error>({
    queryKey: queryKeySingleTag,
    queryFn: async () => {
      if (!tagId) throw new Error("Tag ID is required");
      const response = await axiosInstance.get<ApiResponse<Tag>>(
        `/api/tags/${tagId}`
      );
      return response.data.data;
    },
    enabled: !!tagId,
  });

  // Create new tag
  const {
    mutate: createTag,
    isPending: isCreatingTag,
    error: createTagError,
  } = useMutation({
    mutationFn: async (data: Tag) => {
      const response = await axiosInstance.post<ApiResponse<Tag>>(
        "/api/tags",
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tag Created",
        description: `Tag "${data.name}" has been successfully created.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeyAllTags });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Tag",
        description: error.message || "Could not create the tag.",
        variant: "destructive",
      });
    },
  });

  // Update tag
  const {
    mutate: updateTag,
    isPending: isUpdatingTag,
    error: updateTagError,
  } = useMutation<Tag, Error, { id: number; data: Tag }>({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.put<ApiResponse<Tag>>(
        `/api/tags/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tag Updated",
        description: `Tag "${data.name}" has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeyAllTags });
      queryClient.invalidateQueries({ queryKey: ["tag", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Tag",
        description: error.message || "Could not update the tag.",
        variant: "destructive",
      });
    },
  });

  // Delete tag
  const {
    mutate: deleteTag,
    isPending: isDeletingTag,
    error: deleteTagError,
  } = useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/tags/${id}`);
    },
    onSuccess: (_, id) => {
      toast({
        title: "Tag Deleted",
        description: `Tag has been successfully deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeyAllTags });
      queryClient.removeQueries({ queryKey: ["tag", id] });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Tag",
        description: error.message || "Could not delete the tag.",
        variant: "destructive",
      });
    },
  });

  // Bulk delete tags
  const {
    mutate: bulkDeleteTags,
    isPending: isBulkDeletingTags,
    error: bulkDeleteTagsError,
  } = useMutation<{ deleted: number }, Error, TagBulkDeleteDto>({
    mutationFn: async (data) => {
      const response = await axiosInstance.delete<
        ApiResponse<{ deleted: number }>
      >("/api/tags", { data }); // For DELETE with body
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tags Deleted",
        description: `${data.deleted} tag(s) have been successfully deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeyAllTags });
    },
    onError: (error) => {
      toast({
        title: "Error Bulk Deleting Tags",
        description: error.message || "Could not delete the tags.",
        variant: "destructive",
      });
    },
  });

  // Initialize basic tags for a shop
  const {
    mutate: initBasicTags,
    isPending: isInitializingTags,
    error: initTagsError,
  } = useMutation<Tag[], Error, string>({
    mutationFn: async (shopId) => {
      const response = await axiosInstance.post<ApiResponse<Tag[]>>(
        `/api/tags/init-basic/${shopId}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast({
        title: "Basic Tags Initialized",
        description: "Basic tags have been set up for the shop.",
      });
      queryClient.invalidateQueries({ queryKey: queryKeyAllTags });
    },
    onError: (error) => {
      toast({
        title: "Error Initializing Tags",
        description: error.message || "Could not initialize basic tags.",
        variant: "destructive",
      });
    },
  });

  const {
    mutate: addTagsToConversation,
    isPending: isAddingTagsToConversation,
  } = useMutation({
    mutationFn: async ({
      conversationId,
      tagIds,
    }: {
      conversationId: number;
      tagIds: number[];
    }) => {
      const response = await axiosInstance.post(
        `/api/conversations/${conversationId}/add-tags`,
        { tagIds }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tags Added",
        description: `Tags have been successfully added to the conversation.`,
      });
      queryClient.invalidateQueries({ queryKey: ["conversation", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Tags",
        description: error.message || "Could not add tags to the conversation.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    isAddingTagsToConversation,
    tags,
    tag,
    addTagsToConversation,
    isLoadingTags,
    isLoadingTag,
    isCreatingTag,
    isUpdatingTag,
    isDeletingTag,
    isBulkDeletingTags,
    isInitializingTags,
    // Errors
    fetchTagsError,
    fetchTagError,
    createTagError,
    updateTagError,
    deleteTagError,
    bulkDeleteTagsError,
    initTagsError,
    // Mutations
    createTag,
    updateTag,
    deleteTag,
    bulkDeleteTags,
    initBasicTags,
    // Refetch functions
    refetchTags,
    refetchTag,
  };
};

export default useTags;
