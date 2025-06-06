import { FileText } from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

interface ContactFilesProps {
  files?: SharedFile[];
}

export const ContactFiles = ({ files = [] }: ContactFilesProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Chưa có file nào được chia sẻ</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="p-2 border rounded-md hover:bg-accent cursor-pointer">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size} • {file.date}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
