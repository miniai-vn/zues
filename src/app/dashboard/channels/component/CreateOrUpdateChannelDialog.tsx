"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Channel } from "@/hooks/data/useChannels";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook, Info, Zap } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDepartments from "@/hooks/data/useDepartments";

// New FormSchema
const FormSchema = z.object({
  name: z.string().nonempty("Vui lòng nhập tên kênh."),
  type: z.enum(["zalo", "facebook"], {
    required_error: "Vui lòng chọn loại kênh.",
  }),
  appId: z.string().nonempty("Vui lòng nhập App ID."),
  oaId: z.string().nonempty("Vui lòng nhập OA ID."),
  departmentId: z.coerce.number().min(1, "Vui lòng chọn phòng ban."),
});

interface AddOrUpdateChannelProps {
  channel?: Channel;
  onChange?: (data: Partial<Channel>) => void;
  children?: React.ReactNode;
}

export function CreateOrUpdateChannelDialog({
  channel,
  children,
  onChange,
}: AddOrUpdateChannelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"zalo" | "facebook">(
    channel?.type === "facebook" ? "facebook" : "zalo"
  );

  // Get departments
  const { departments = [] } = useDepartments({});

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: channel?.name || "",
      type: (channel?.type as "zalo" | "facebook") || "zalo",
      appId:
        channel?.type === "zalo" ? (channel.extraData as { app_id?: string })?.app_id || "" : "",
      oaId:
        channel?.type === "zalo"
          ? (channel.extraData as { oa_id?: string })?.oa_id || ""
          : "",
      departmentId: channel?.departmentId || undefined,
    },
  });

  // Sync tab and form type
  const handleTabChange = (value: string) => {
    setTab(value as "zalo" | "facebook");
    form.setValue("type", value as "zalo" | "facebook");
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const dataSubmit = {
      name: data.name,
      type: tab,
      department_id: data.departmentId,
      extra_data: {
        oa_id: data.oaId,
        app_id: data.appId,
      },
      ...(channel ? { id: channel.id } : {}),
    };
    onChange?.(dataSubmit);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {children || <Button>+ Tạo kênh</Button>}
      </DialogTrigger>
      <DialogContent className="w-[50vw] max-w-[70vw] ">
        <DialogHeader>
          <DialogTitle>{channel ? "Cập nhật kênh" : "Tạo kênh"}</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={handleTabChange} className="mb-">
          <TabsList className="w-full flex">
            <TabsTrigger
              value="zalo"
              className="flex-1 flex items-center gap-2 justify-center"
            >
              <Zap className="w-4 h-4 text-blue-500" />
              Zalo OA
            </TabsTrigger>
            <TabsTrigger
              value="facebook"
              className="flex-1 flex items-center gap-2 justify-center"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook Message
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Form {...form}>
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <div className="flex">
              <Info size={18} className="text-blue-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Trước khi bắt đầu</p>
                <p>
                  Bạn cần có một tài khoản OA Zalo chính thức. Nếu chưa có, vui
                  lòng tạo OA trên{" "}
                  <a
                    href="https://oa.zalo.me"
                    target="_blank"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Zalo Business
                  </a>{" "}
                  trước khi tiếp tục.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Tên kênh <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Nhập tên kênh"
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            {/* type is hidden, controlled by tab */}
            <input type="hidden" {...form.register("type")} />
            <FormField
              control={form.control}
              name="oaId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    OA ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Nhập OA ID"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ID của Official Account Zalo của bạn
                  </p>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    APP ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Nhập OA ID"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lấy từ trang "Thông tin ứng dụng" của Zalo Developers
                  </p>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="oaId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    App Id <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Nhập OA ID"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Lấy từ trang "Thông tin ứng dụng" của Zalo Developers
                  </p>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Phòng ban <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white">
                {channel ? "Cập nhật" : "Tạo kênh"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
