"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionPopover from "@/components/dashboard/popever";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useResource, { Resource } from "@/hooks/data/useResource";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { convertBytesToMB } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { File, FileText, Image, Pencil, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateOrUpdateResource } from "./documents/components/CreateOrUpdateResource";
import DepartmentHeader from "./DepartmentHeader";
import useDepartments from "@/hooks/data/useDepartments";
import useFAQs, { FAQ } from "@/hooks/data/useFAQs";
import { FaqsModal } from "./documents/components/faqs-modal";

const DepartmentDetailComponent = () => {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.id as string;

  const [search, setSearch] = useState("");
  useDebouncedValue(search, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "csv":
      case "xlsx":
      case "xls":
        return <FileText className="h-6 w-6 text-green-500" />;
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  const {
    materialItems,
    createResource,
    refetchMaterialItems,
    deleteResource,
    createChunks,
    syncResource,
    isPendingCreateChunks,
    isPendingCreateResource,
    isPendingDeleteResource,
    isPendingFetchingItem,
    isPendingSyncResource,
  } = useResource({
    departmentId: departmentId,
    page,
    limit: pageSize,
    search,
  });
  const { departmentDetail } = useDepartments({
    id: departmentId,
  });

  // FAQ state
  const [faqSearch, setFaqSearch] = useState("");
  useDebouncedValue(faqSearch, 500);
  const [faqPage, setFaqPage] = useState(1);
  const [faqPageSize, setFaqPageSize] = useState(10);

  const { faqs, isPendingFetchingFaqs, refetchFaqs, deleteFAQ, updateFAQ } =
    useFAQs({
      departmentId,
      page: faqPage,
      limit: faqPageSize,
      search: faqSearch,
    });

  useEffect(() => {
    if (materialItems) {
      setPage(materialItems.page || 1);
      setPageSize(materialItems.limit || 10);
    }
  }, [materialItems]);

  const onHandleUploadFile = async (
    file: File,
    description: string,
    type: string
  ) => {
    try {
      await createResource({
        file,
        departmentId,
        description,
        type: type,
      });
    } catch (error) {
      throw error;
    } finally {
      refetchMaterialItems();
    }
  };

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const columns: ColumnDef<Resource>[] = [
    {
      id: "index",
      header: () => <div className="text-center">STT</div>, // Add this to center the header
      cell: ({ row }) => (
        <div className="flex items-center justify-center">{row.index + 1}</div>
      ),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Tên tệp",
      cell: (row) => {
        return (
          <div className="break-all flex items-center gap-2 line-clamp-2">
            <span>
              {getFileIcon(row.row.original.extra.extension as string)}
            </span>
            <span>{row.row.original.name}</span>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "type",
      header: "Loại tài liệu",
      cell: (row) => (
        <div className="break-all line-clamp-1">{row.row.original?.type}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "size",
      header: "Dung lượng",
      cell: (row) => (
        <div className="break-all line-clamp-1">
          {convertBytesToMB(row.row.original.extra.size as number)}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: (row) => (
        <div className="break-all line-clamp-1">
          {row.row.original.description}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian tải lên",
      cell: (row) => (
        <div className="whitespace-nowrap">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng thái</div>,
      cell: (row) => {
        const status = row.row.original.status;
        let statusText = status;
        let statusClass = "bg-gray-100 text-gray-800";

        if (isPendingCreateChunks || isPendingSyncResource) {
          return (
            <div className="flex items-center justify-center z-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          );
        }

        switch (status) {
          case "new":
            statusText = "Mới";
            statusClass = "bg-blue-100 text-blue-800";
            break;
          case "processing":
            statusText = "Đã phân đoạn";
            statusClass = "bg-yellow-100 text-yellow-800";
            break;
          case "finished":
            statusText = "Đã train";
            statusClass = "bg-green-100 text-green-800";
            break;
          case "active":
            statusText = "Hoạt động";
            statusClass = "bg-green-100 text-green-800";
            break;
          default:
            break;
        }

        return (
          <div className="flex items-center justify-center w-full">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
            >
              {statusText}
            </span>
          </div>
        );
      },
      size: 120,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Hành động</div>,
      cell: (row) => {
        const documentId = row.row.original.id as unknown as string;
        const isActive = row.row.original.isActive === true;

        return (
          <div className="flex items-center justify-center w-full gap-2">
            <div className="flex items-center">
              <Switch
                id={`status-switch-${documentId}`}
                checked={isActive}
                onCheckedChange={(checked) => {
                  createChunks(documentId);
                  console.log(
                    `Document ${documentId} status changed to ${
                      checked ? "active" : "inactive"
                    }`
                  );
                }}
              />
            </div>
            <ActionPopover
              onArchive={() => syncResource(documentId)}
              onDelete={() => deleteResource(documentId)}
              onConfigure={() => {
                router.push(
                  `/dashboard/departments/${departmentId}/documents/${documentId}`
                );
              }}
              deleteDescription="Bạn có chắc chắn muốn xóa tài liệu này không?"
              deleteTitle="Xóa tài liệu"
            />
          </div>
        );
      },
      size: 140,
    },
  ];

  // FAQ columns
  const faqColumns: ColumnDef<FAQ>[] = [
    {
      id: "index",
      header: () => <div className="text-center">STT</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">{row.index + 1}</div>
      ),
      size: 60,
    },
    {
      accessorKey: "question",
      header: "Câu hỏi",
      cell: (row) => (
        <div className="break-all line-clamp-1">
          {row.row.original.question}
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "answer",
      header: "Trả lời",
      cell: (row) => (
        <div className="break-all line-clamp-1">{row.row.original.answer}</div>
      ),
      size: 400,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: (row) => (
        <div className="whitespace-nowrap">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
      size: 150,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Hành động</div>,
      cell: (row) => {
        const documentId = row.row.original.id as unknown as string;

        return (
          <ActionPopover
            onDelete={() => deleteFAQ(documentId)}
            children={
              <FaqsModal
                children={
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 w-full"
                  >
                    <Pencil size={16} />
                    <span>Chỉnh sửa</span>
                  </Button>
                }
                faq={row.row.original}
                onChange={(data) => {
                  if (typeof data.id === "number") {
                    updateFAQ({ ...data, id: data.id });
                  }
                }}
              />
            }
            deleteDescription="Bạn có chắc chắn muốn xóa tài liệu này không?"
            deleteTitle="Xóa tài liệu"
          />
        );
      },
      size: 140,
    },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 space-y-2">
      <PageHeader
        backButtonHref="/dashboard/departments"
        showBackButton={true}
        breadcrumbs={[
          {
            label: "Quản lý nhóm tài liệu",
            href: "/dashboard/departments",
          },
          {
            label: "Quản lý tài liệu",
            isCurrentPage: true,
          },
        ]}
      />
      {/* {departmentDetail && <DepartmentHeader dept={departmentDetail} />} */}

      <Tabs defaultValue="documents" className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <TabsList>
              <TabsTrigger value="documents">Tài liệu</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push(`/dashboard/channels`);
            }}
          >
            Liên kết đến nền tảng
          </Button>
        </div>
        <TabsContent value="documents">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Tìm kiếm tài tên tài liệu"
              className="mr-4 w-full flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={() => refetchMaterialItems()}
                className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Search />
                Tìm kiếm
              </Button>

              <CreateOrUpdateResource
                type="document"
                onHandleUploadFile={onHandleUploadFile}
                resource={undefined}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={materialItems?.items || []}
            pagination={{
              page: page,
              limit: pageSize,
              total: materialItems?.totalCount || 0,
            }}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={
              isPendingFetchingItem ||
              isPendingCreateResource ||
              isPendingDeleteResource
            }
          />
        </TabsContent>

        <TabsContent value="faqs">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Tìm kiếm câu hỏi"
              className="mr-4 w-full flex-1"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={() => refetchFaqs()}
                className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Search />
                Tìm kiếm
              </Button>
              <Button>Đào tạo toàn bộ</Button>
              {/* Add CreateOrUpdateResource for FAQs if needed */}
              <FaqsModal
                onChange={(data) => {
                  if (typeof data.id === "number") {
                    updateFAQ({ ...data, id: data.id });
                  }
                }}
              />
            </div>
          </div>
          <DataTable
            columns={faqColumns}
            data={faqs?.items || []}
            pagination={{
              page: faqPage,
              limit: faqPageSize,
              total: faqs?.totalCount || 0,
            }}
            onPaginationChange={setFaqPage}
            onPageSizeChange={setFaqPageSize}
            isLoading={isPendingFetchingFaqs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DepartmentDetailComponent;
