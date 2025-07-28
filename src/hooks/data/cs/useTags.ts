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
  conversationCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagQueryParamsDto {
  type?: TagType;
  shopId?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export type TagsListResponse = Tag[];

interface UseTagsProps {
  queryParams?: TagQueryParamsDto;
  tagId?: number;
}

const useTags = (
  { queryParams = {}, tagId }: UseTagsProps = {
    queryParams: {
      type: TagType.CUSTOMER,
      page: 1,
      limit: 100,
    },
    tagId: undefined,
  }
) => {
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
      return response.data.data as Tag[];
    },
    refetchOnWindowFocus: false,
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
      const response = await axiosInstance.post("/api/tags", data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Tag Created",
        description: `Tag  has been successfully created.`,
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
      return response.data;
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

  const {
    mutate: addTagsToCustomer,
    isPending: isAddingTagsToCustomer,
    error: addTagsToCustomerError,
  } = useMutation({
    mutationFn: async ({
      customerId,
      tagIds,
    }: {
      customerId: string;
      tagIds: number[];
    }) => {
      const response = await axiosInstance.post(
        `/api/customers/${customerId}/add-tags`,
        { tagIds }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Tags Added",
        description: `Tags have been successfully added to the customer.`,
      });
    },
    onError: () => {
      toast({
        title: "Error Adding Tags",
        description: "Could not add tags to the customer.",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    isAddingTagsToConversation,
    tags,
    tag,
    isLoadingTags,
    isLoadingTag,
    isCreatingTag,
    isUpdatingTag,
    isDeletingTag,
    fetchTagsError,
    fetchTagError,
    createTagError,
    updateTagError,
    deleteTagError,
    addTagsToCustomerError,
    isAddingTagsToCustomer,

    // Action
    addTagsToCustomer,
    addTagsToConversation,
    createTag,
    updateTag,
    deleteTag,
    refetchTags,
    refetchTag,
  };
};

export default useTags;
