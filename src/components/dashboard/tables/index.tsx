import { DataTable } from "./data-table";

interface DataTableProps {
  columns: any;
  data: any;
}

const TableDemo = ({ columns, data }: DataTableProps) => {
  return (
    
      <DataTable columns={columns} data={data} />
  
  );
};

export default TableDemo;
