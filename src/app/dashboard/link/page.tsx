"use client";
import TableDemo from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import useKnowledge, { MaterialItem } from "@/hooks/data/useKnowledge";
import { ColumnDef } from "@tanstack/react-table";
import { LinkModal } from "./create-link-modal";

const Meterials = () => {
  const { materialItems, deleteMaterialItem, createLinkKnowLedge } =
    useKnowledge({
      type: "link",
    });
  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "link",
      header: "Link",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original?.material?.name}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "text",
    //   header: "Text",
    //   cell: (row) => {
    //     return (
    //       <div className="break-all line-clamp-2 w-1/2">
    //         {row.row.original.text}
    //       </div>
    //     );
    //   },
    // },

    {
      accessorKey: "metaTitle",
      header: "Meta title",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original.url}
          </div>
        );
      },
    },

    {
      accessorKey: "metaDescription",
      header: "Meta description",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original.url}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex gap-2">
            <Badge>Sync</Badge>
            <Badge
              className="border bg-white text-red-700 border-red-700"
              onClick={() =>
                row.row.original.id && deleteMaterialItem(row.row.original.id)
              }
            >
              Delete
            </Badge>
          </div>
        );
      },
    },
  ];
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm tài tên tài liệu"
          className="mr-4 w-full flex-1"
        />
        <LinkModal onChange={createLinkKnowLedge} />
      </div>
      <TableDemo columns={columns} data={materialItems ?? []} />
    </div>
  );
};

export default Meterials;
