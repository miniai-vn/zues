"use client";
import TableDemo from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { AddMeterial, Meterial } from "./add-meterial";
import { useMaterials } from "@/hooks/data/useMaterials";

const Meterials = () => {
  const { materials, createMaterial, deleteMeterial } = useMaterials();
  const columns: ColumnDef<Meterial>[] = [
    {
      accessorKey: "id",
      header: "id",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => {
        const original = row.row.original;
        return (
          <Switch
            checked={original?.status === "active"}
            onChange={(checked) => console.log(checked)}
          />
        );
      },
    },
    {
      id: "sync",
      header: "Sync",
      cell: (row) => {
        return <Badge onClick={() => console.log(row)}>Sync</Badge>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex gap-2">
            <Badge
              className="border bg-white text-green-700 border-green-700"
              onClick={() => console.log(row)}
            >
              Add items
            </Badge>
            <Badge
              className="border bg-white text-red-700 border-red-700"
              onClick={() =>
                row.row.original.id && deleteMeterial(row.row.original.id)
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
        <AddMeterial onChange={createMaterial} />
      </div>
      <TableDemo columns={columns} data={materials ?? []} />
    </div>
  );
};

export default Meterials;
