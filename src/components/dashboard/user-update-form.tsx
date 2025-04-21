import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/hooks/data/useAuth";

const userFormSchema = z.object({
  name: z.string().min(3, "Tên đại diện phải có ít nhất 3 ký tự").max(50, "Tên đại diện không được vượt quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ").optional(),
  phone: z.string().regex(/^\d+$/, "Số điện thoại phải là số").min(8, "Số điện thoại phải có ít nhất 8 ký tự").max(15, "Số điện thoại không được vượt quá 15 ký tự").optional(),
  avatar: z.string().optional(),
});

export type UserUpdateFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (data: UserUpdateFormValues) => void;
  initialData?: Partial<User>;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      avatar: initialData?.avatar || "",
    },
  });

  const handleFormSubmit = (data: UserUpdateFormValues) => {
    onSubmit(data);
    reset({
      name: "",
      email: "",
      phone: "",
      avatar: "",
    });
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      console.log("Selected file:", event.target.files[0]);
    }
  };

  const triggerFileInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <form
      className="space-y-6 w-full max-w-3xl mx-auto p-8"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Thông tin quản lý</h2>
        </div>

        <div className="flex justify-between items-start gap-8">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên đại diện</Label>
              <Input
                id="name"
                placeholder="Minh"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Đây là tên hiển thị công khai của bạn. Nó có thể là tên thật của bạn hoặc một bút danh. Bạn chỉ có thể thay đổi điều này một lần 30 ngày.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Minh@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Bạn có thể quản lý địa chỉ email đã được xác minh trong cài đặt email của mình.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0936477261"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100">
              {initialData?.name && (
                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-2xl font-semibold text-white">
                  {initialData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <img
                src={initialData?.avatar || "https://th.bing.com/th/id/OIP.gYaUpJvv-3E-stUjZ-Pd2AHaHa?rs=1&pid=ImgDetMain"}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileInput}
              />
            </div>
            <Button
              variant="outline"
              className="text-sm"
              onClick={triggerFileInput}
            >
              Tải ảnh đại diện
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Kích thước ảnh tối thiếu 256 x 256 px<br />
              Hỗ trợ định dạng PNG hoặc JPEG
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" type="submit">Cập nhật thông tin</Button>
      </div>
    </form>
  );
}