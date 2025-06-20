import { DataTable } from "./data-table";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { t } = useTranslations();
  
  return (
    <DataTable pagination={pagination} columns={columns} data={data}/>
  );
};

export default Tables;
