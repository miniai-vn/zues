import { DataTable } from "./data-table";

interface DataTableProps {
  columns: any;
  data: any;
  pagination: {
    page: number;
    limit: number;
    search?: string;
  }
}

const Tables = ({ columns, data, pagination }: DataTableProps) => {
  return (
    <DataTable pagination={pagination} columns={columns} data={data}/>
  );
};

export default Tables;
