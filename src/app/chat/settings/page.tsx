"use client";
import { useState } from "react";
import {
  Download,
  FileText,
  Eye,
  EyeOff,
  Phone,
  MessageSquare,
  Key,
  Plus,
  Search,
  Upload,
  Smile,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { TagManagement } from "./TagManagement";

export default function Settings() {
  const [settings, setSettings] = useState({
    customerInfo: {
      downloadCustomerInfo: true,
      showUnreadChatsFirst: false,
      autoHideWhenCommentingOnReviews: false,
      autoHideComments: false,
    },
    comments: {
      enableAllComments: false,
      enableCommentsByPhoneNumber: false,
      enableCommentsWithoutPhoneNumber: false,
    },
    liveComment: {
      autoUpdateFromLivestream: false,
      phoneNumberFilter: "",
      hasPhoneNumber: false,
      customerResponse: false,
      unreadChatFilter: false,
    },
  });

  const [tags] = useState([
    {
      id: 1,
      name: "VIP",
      conversations: 15,
      date: "2024-01-15",
      color: "blue",
    },
    {
      id: 2,
      name: "Hot Lead",
      conversations: 23,
      date: "2024-01-10",
      color: "red",
    },
    {
      id: 3,
      name: "Follow Up",
      conversations: 8,
      date: "2024-01-08",
      color: "green",
    },
  ]);

  const [staff] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      conversations: 25,
      date: "2024-01-01",
      role: "Admin",
    },
    {
      id: 2,
      name: "Trần Thị B",
      conversations: 18,
      date: "2024-01-05",
      role: "Staff",
    },
  ]);

  const [templates] = useState([
    { id: "WELCOME", content: "Chào mừng bạn đến với cửa hàng của chúng tôi!" },
    { id: "THANK", content: "Cảm ơn bạn đã quan tâm đến sản phẩm!" },
  ]);

  const handleSave = () => {
    toast({
      title: "Đã lưu cài đặt",
      description: "Các tùy chọn của bạn đã được cập nhật thành công.",
    });
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex-1 bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="h-12 p-1 bg-muted/50 border border-border/50">
              <TabsTrigger
                value="general"
                className="px-6 py-2 text-sm font-medium"
              >
                Cài đặt chung
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="px-6 py-2 text-sm font-medium"
              >
                Quản lý nhân viên
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="px-6 py-2 text-sm font-medium"
              >
                Quản lý thẻ
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="px-6 py-2 text-sm font-medium"
              >
                Tin nhắn mẫu
              </TabsTrigger>
              <TabsTrigger
                value="mail"
                className="px-6 py-2 text-sm font-medium"
              >
                Thư viện ảnh
              </TabsTrigger>
              <TabsTrigger
                value="share"
                className="px-6 py-2 text-sm font-medium"
              >
                Chia hỏi thoại
              </TabsTrigger>
              <TabsTrigger
                value="filter"
                className="px-6 py-2 text-sm font-medium"
              >
                Lọc từ khoá
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="px-6 py-2 text-sm font-medium"
              >
                Salework Contact
              </TabsTrigger>
              <TabsTrigger value="ai" className="px-6 py-2 text-sm font-medium">
                Cấu hình AI
              </TabsTrigger>
            </TabsList>

            {/* Main Content */}
            <div className="p-6">
              <TabsContent value="general" className="space-y-6 mt-0">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-6">
                    Cài đặt chung
                  </h1>
                </div>

                {/* Customer Info Section */}
                <Card className="border border-border/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Tải thông tin khách hàng
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Tải về
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tải về thông tin khách hàng dưới dạng file excel.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <Label className="text-sm">
                          Hiển thị hội thoại chưa đọc lên đầu
                        </Label>
                        <Switch
                          checked={settings.customerInfo.showUnreadChatsFirst}
                          onCheckedChange={(value) =>
                            updateSetting(
                              "customerInfo",
                              "showUnreadChatsFirst",
                              value
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label className="text-sm">
                          Tự động ẩn like khi trả lời bình luận
                        </Label>
                        <Switch
                          checked={
                            settings.customerInfo
                              .autoHideWhenCommentingOnReviews
                          }
                          onCheckedChange={(value) =>
                            updateSetting(
                              "customerInfo",
                              "autoHideWhenCommentingOnReviews",
                              value
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <Label className="text-sm">Tự động ẩn bình luận</Label>
                        <Switch
                          checked={settings.customerInfo.autoHideComments}
                          onCheckedChange={(value) =>
                            updateSetting(
                              "customerInfo",
                              "autoHideComments",
                              value
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Comment Settings */}
                    <div className="pt-4 border-t border-border/50">
                      <h3 className="text-sm font-medium mb-4">
                        Tự động ẩn bình luận
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="all-comments"
                            checked={settings.comments.enableAllComments}
                            onCheckedChange={(value) =>
                              updateSetting(
                                "comments",
                                "enableAllComments",
                                value
                              )
                            }
                          />
                          <Label htmlFor="all-comments" className="text-sm">
                            Tất cả bình luận
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="phone-comments"
                            checked={
                              settings.comments.enableCommentsByPhoneNumber
                            }
                            onCheckedChange={(value) =>
                              updateSetting(
                                "comments",
                                "enableCommentsByPhoneNumber",
                                value
                              )
                            }
                          />
                          <Label htmlFor="phone-comments" className="text-sm">
                            Bình luận có số điện thoại
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="no-phone-comments"
                            checked={
                              settings.comments.enableCommentsWithoutPhoneNumber
                            }
                            onCheckedChange={(value) =>
                              updateSetting(
                                "comments",
                                "enableCommentsWithoutPhoneNumber",
                                value
                              )
                            }
                          />
                          <Label
                            htmlFor="no-phone-comments"
                            className="text-sm"
                          >
                            Bình luận không có số điện thoại
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Comment Update Section */}
                <Card className="border border-border/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5" />
                      Cập nhật bình luận từ bài viết livestream
                      <Switch
                        checked={settings.liveComment.autoUpdateFromLivestream}
                        onCheckedChange={(value) =>
                          updateSetting(
                            "liveComment",
                            "autoUpdateFromLivestream",
                            value
                          )
                        }
                        className="ml-auto"
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">
                        Tự động gắn thẻ hội thoại
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">
                            Hội thoại có số điện thoại
                          </Label>
                          <Select value="" onValueChange={() => {}}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn tag" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hot">Hot</SelectItem>
                              <SelectItem value="important">
                                Important
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="has-phone"
                              checked={settings.liveComment.hasPhoneNumber}
                              onCheckedChange={(value) =>
                                updateSetting(
                                  "liveComment",
                                  "hasPhoneNumber",
                                  value
                                )
                              }
                            />
                            <Label htmlFor="has-phone" className="text-sm">
                              Khách hàng có đơn
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customer-response"
                            checked={settings.liveComment.customerResponse}
                            onCheckedChange={(value) =>
                              updateSetting(
                                "liveComment",
                                "customerResponse",
                                value
                              )
                            }
                          />
                          <Label
                            htmlFor="customer-response"
                            className="text-sm"
                          >
                            Hội thoại có chưa từ khóa
                          </Label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          onClick={handleSave}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Staff Management Tab */}
              <TabsContent value="staff" className="space-y-6 mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-foreground">
                      Quản lý nhân viên
                    </h1>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Tìm kiếm thẻ..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo thẻ mới
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Sắp xếp
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên nhân viên</TableHead>
                          <TableHead>Số hội thoại đã gán</TableHead>
                          <TableHead>Ngày tạo</TableHead>
                          <TableHead>Vai trò</TableHead>
                          <TableHead>Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staff.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">
                              {member.name}
                            </TableCell>
                            <TableCell>{member.conversations}</TableCell>
                            <TableCell>{member.date}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{member.role}</Badge>
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
                    Tổng: {staff.length} &nbsp;&nbsp;&nbsp; Số nhân viên đã gán
                    thẻ: {staff.length}
                  </div>
                </div>
              </TabsContent>

              {/* Tag Management Tab */}
              <TabsContent value="permissions" className="space-y-6 mt-0">
                <TagManagement />
              </TabsContent>

              {/* Message Templates Tab */}
              <TabsContent value="messages" className="space-y-6 mt-0">
                <div className="space-y-6">
                  <h1 className="text-2xl font-semibold text-foreground">
                    Tin nhắn mẫu
                  </h1>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Template Creation */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Tin nhắn mẫu
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Nhập từ file Excel
                          </Button>

                          <div className="space-y-2">
                            <Label>Tất cả các kênh</Label>
                            <Select defaultValue="all">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Tất cả các kênh
                                </SelectItem>
                                <SelectItem value="facebook">
                                  Facebook
                                </SelectItem>
                                <SelectItem value="zalo">Zalo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Chọn cửa hàng</Label>
                            <Select defaultValue="all">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Tất cả cửa hàng
                                </SelectItem>
                                <SelectItem value="store1">
                                  Cửa hàng 1
                                </SelectItem>
                                <SelectItem value="store2">
                                  Cửa hàng 2
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Mã</Label>
                            <Input placeholder="/" />
                          </div>

                          <div className="space-y-2">
                            <Label>Nội dung tin nhắn</Label>
                            <Textarea
                              placeholder="Nội dung tin nhắn"
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <ImageIcon className="h-4 w-4" />
                            <Smile className="h-4 w-4" />
                            <span>Chọn nội dung có sẵn</span>
                          </div>

                          <Button className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300">
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
                              <Select defaultValue="all">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">
                                    Tất cả các kênh
                                  </SelectItem>
                                  <SelectItem value="facebook">
                                    Facebook
                                  </SelectItem>
                                  <SelectItem value="zalo">Zalo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Chọn cửa hàng</Label>
                              <Select defaultValue="all">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">
                                    Tất cả các cửa hàng
                                  </SelectItem>
                                  <SelectItem value="store1">
                                    Cửa hàng 1
                                  </SelectItem>
                                  <SelectItem value="store2">
                                    Cửa hàng 2
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Tìm kiếm" className="pl-10" />
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Mã</TableHead>
                                <TableHead>Tin nhắn</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {templates.map((template) => (
                                <TableRow key={template.id}>
                                  <TableCell className="font-medium">
                                    {template.id}
                                  </TableCell>
                                  <TableCell>{template.content}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mail" className="space-y-6 mt-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Thư viện ảnh - Chức năng đang phát triển
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="share" className="space-y-6 mt-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Chia hỏi thoại - Chức năng đang phát triển
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="filter" className="space-y-6 mt-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Lọc từ khoá - Chức năng đang phát triển
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6 mt-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Salework Contact - Chức năng đang phát triển
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6 mt-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Cấu hình AI - Chức năng đang phát triển
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
