import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Download, Eye, EyeOff } from "lucide-react";
import CreateTagDialog from "@/components/tag-manager/CreateTagDialog";

const tags = [
  {
    id: 1,
    name: "Tag 1",
    conversations: 10,
    date: "2023-10-01",
    color: "red",
  },
  {
    id: 2,
    name: "Tag 2",
    conversations: 5,
    date: "2023-10-02",
    color: "blue",
  },
  {
    id: 3,
    name: "Tag 3",
    conversations: 8,
    date: "2023-10-03",
    color: "green",
  },
];

export const TagManagement = () => {
  const [openCreateTag, setOpenCreateTag] = useState(false);
  const [tagList, setTagList] = useState(tags);

  const handleTagCreated = (newTag) => {
    setTagList((prev) => [...prev, newTag]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Quản lý thẻ</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Tìm kiếm thẻ..." className="pl-10 w-64" />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setOpenCreateTag(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo thẻ mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>

      <CreateTagDialog
        open={openCreateTag}
        onOpenChange={setOpenCreateTag}
        onTagCreated={handleTagCreated}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên thẻ</TableHead>
              <TableHead>Số hội thoại đã gán</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagList.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.conversations}</TableCell>
                <TableCell>{tag.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full`}
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <span className="capitalize">{tag.color}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="text-sm text-muted-foreground">
        Tổng: {tagList.length} &nbsp;&nbsp;&nbsp; Số hội thoại đã gán thẻ:{" "}
        {tagList.reduce((sum, tag) => sum + tag.conversations, 0)}
      </div>
    </div>
  );
};
