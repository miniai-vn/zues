import DocumentCard from "./ChunkCart";

// Define item structure
interface DocumentItem {
  id: string;
  title: string;
  date: string;
  time: string;
  content: string;
  description: string;
  isCompleted: boolean;
}

// Define props for the component
interface DocumentCartListProps {
  selectedItems?: string[];
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function DocumentCartList({}: DocumentCartListProps) {
  // Sample data - in a real app this would come from props or API
  const documents: DocumentItem[] = [
    {
      id: "doc1",
      title: "Đoạn văn 1",
      date: "12/08/2025",
      time: "14:30:06",
      content: "Công Nghệ Theo Áp Dụng Trong Quản Lí Nhân...",
      description:
        "Theo dõi lượng hàng hóa bán ra tăng hay giảm. Lượng hàng hoá bán ra không chỉ phản ánh tình hình kinh doanh của doanh nghiệp mà còn phản á...",
      isCompleted: true,
    },
    {
      id: "doc2",
      title: "Đoạn văn 2",
      date: "10/08/2025",
      time: "09:15:30",
      content: "Phân Tích Dữ Liệu Trong Marketing...",
      description:
        "Sử dụng các công cụ phân tích dữ liệu để tối ưu hóa chiến dịch marketing. Các số liệu thu thập được giúp đánh giá hiệu quả và đưa ra...",
      isCompleted: false,
    },
    {
      id: "doc3",
      title: "Đoạn văn 3",
      date: "05/08/2025",
      time: "16:45:22",
      content: "Báo Cáo Tài Chính Quý 3...",
      description:
        "Tổng hợp các chỉ số tài chính quan trọng trong quý 3. Doanh thu tăng 15% so với cùng kỳ năm trước, lợi nhuận ròng đạt...",
      isCompleted: true,
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="relative">
            <DocumentCard
              title={doc.title}
              date={doc.date}
              time={doc.time}
              content={doc.content}
              description={doc.description}
              isCompleted={doc.isCompleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
