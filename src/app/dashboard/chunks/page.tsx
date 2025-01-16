"use client";
import TableDemo from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import useMaterialItems, { MaterialItem } from "@/hooks/data/useMaterialItems";
import { ColumnDef } from "@tanstack/react-table";
import { AddMeterialItemModal } from "./add-meterial-items";

const Meterials = () => {
  const {
    materialItems,
    createMaterialItem,
    deleteMaterialItem,
    syncMaterialItem,
  } = useMaterialItems();
  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "id",
      header: "id",
    },
    {
      accessorKey: "material",
      header: "Material",
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
      accessorKey: "file",
      header: "File",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original.file as string}
          </div>
        );
      },
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original.url}
          </div>
        );
      },
    },

    {
      id: "sync",
      header: "Sync",
      cell: (row) => {
        return (
          <Badge
            onClick={() =>
              row.row.original.id && syncMaterialItem(row.row.original.id)
            }
          >
            Sync
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex gap-2">
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
          placeholder="Filter name..."
          className="max-w-sm w-full flex-1"
        />
        <AddMeterialItemModal onChange={createMaterialItem} />
      </div>
      <TableDemo columns={columns} data={materialItems ?? []} />
    </div>
  );
};

export default Meterials;
