"use client";
import TableDemo from "@/components/dashboard/tables";
import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: (row) => {
      return <Badge onClick={() => console.log(row)}>Sync</Badge>;
    },
  },
];

const data = [
  {
    id: "728ed52f",
    title: "Tài liệu nhân viên",
    description: "Tài liệu hướng dẫn nhân viên",
  },
  // ...
];
const Meterials = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <TableDemo columns={columns} data={data} />
    </div>
  );
};

export default Meterials;
