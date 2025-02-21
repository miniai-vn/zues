import { DataTable } from "./data-table";

interface DataTableProps {
  columns: any;
  data: any;
  onChange?: (value: any) => void;
  page?: number;
}

const Tables = ({ columns, data, onChange, page }: DataTableProps) => {
  return (
    <DataTable page={page} columns={columns} data={data} onChange={onChange} />
  );
};

export default Tables;
