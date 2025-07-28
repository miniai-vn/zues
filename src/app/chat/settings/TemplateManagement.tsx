import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Upload, ImageIcon, Smile, Search } from "lucide-react";
import useTemplates, { Template } from "@/hooks/useTemplates";
import useChannels from "@/hooks/data/useChannels";

export function TemplateManagement() {
  const [code, setCode] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [channelId, setChannelId] = useState("all");
  // Thêm state riêng cho filter ở bảng
  const [tableChannelId, setTableChannelId] = useState("all");

  const { templates, createTemplate, updateTemplate, deleteTemplate } =
    useTemplates({
      queryParams: {
        channelId: tableChannelId !== "all" ? tableChannelId : undefined,
      },
    });

  const { channels } = useChannels({});

  // Tạo mới template
  const handleCreate = () => {
    if (!code.trim() || !content.trim()) return;
    createTemplate({
      code,
      content,
      ...(channelId === "all" ? {} : { channelId }),
    });
    setCode("");
    setContent("");
  };

  // Xóa template
  const handleDelete = (id: string) => {
    deleteTemplate(id);
  };

  // Update template (ví dụ: mở dialog sửa, ở đây chỉ demo nút)
  const handleUpdate = (template: Template) => {
    updateTemplate({ ...template, content: template.content + " (updated)" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tin nhắn mẫu</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Template Creation */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tin nhắn mẫu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Nhập từ file Excel
              </Button>

              <div className="space-y-2">
                <Label>Tất cả các kênh</Label>
                <Select
                  defaultValue="all"
                  onValueChange={(v) => setChannelId(v)}
                  value={channelId}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả các kênh</SelectItem>
                    {channels?.map((channel) => (
                      <SelectItem
                        key={channel.id}
                        value={channel.id.toString()}
                      >
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mã</Label>
                <Input
                  placeholder="/"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nội dung tin nhắn</Label>
                <Textarea
                  placeholder="Nội dung tin nhắn"
                  className="min-h-[100px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600">
                <ImageIcon className="h-4 w-4" />
                <Smile className="h-4 w-4" />
                <span>Chọn nội dung có sẵn</span>
              </div>

              <Button
                className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={handleCreate}
                disabled={!code.trim() || !content.trim()}
              >
                Tạo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Columns - Template List */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Danh sách tin nhắn mẫu
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Xuất file Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Chọn kênh</Label>
                  <Select
                    defaultValue="all"
                    onValueChange={(v) => setTableChannelId(v)}
                    value={tableChannelId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả các kênh</SelectItem>
                      {channels?.map((channel) => (
                        <SelectItem
                          key={channel.id}
                          value={channel.id.toString()}
                        >
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm"
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tin nhắn</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates?.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.code}
                      </TableCell>
                      <TableCell>{template.content}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdate(template)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(template.id!)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
