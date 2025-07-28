"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Download, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { TagManagement } from "./TagManagement";
import { TemplateManagement } from "./TemplateManagement";
import { UserManagement } from "./UserManagement";

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

  const handleSave = () => {
    toast({
      title: "Đã lưu cài đặt",
      description: "Các tùy chọn của bạn đã được cập nhật thành công.",
    });
  };

  const updateSetting = (
    category: string,
    key: string,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex-1 bg-background w-full max-h-screen overflow-y-auto max-w-screen">
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
                <UserManagement />
              </TabsContent>

              {/* Tag Management Tab */}
              <TabsContent value="permissions" className="space-y-6 mt-0">
                <TagManagement />
              </TabsContent>

              {/* Message Templates Tab */}
              <TabsContent value="messages" className="space-y-6 mt-0">
                <TemplateManagement />
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
