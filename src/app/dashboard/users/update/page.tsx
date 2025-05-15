"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import {
  UserForm,
  UserUpdateFormValues,
} from "@/components/dashboard/user-update-form";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, useUserStore } from "@/hooks/data/useAuth";

const UserUpdateComponents = () => {
  const { updateUser } = useAuth({});
  const { user } = useUserStore();

  const handleUpdateUser = async (data: UserUpdateFormValues) => {
    try {
      await updateUser({ ...data, id: user?.id });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="min-h-screen">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            {
              label: "Quản lý",
              href: "/dashboard/users",
            },
            {
              label: "Cập nhật người dùng",
              href: "/dashboard/users",
              isCurrentPage: true,
            },
          ]}
        />
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 gap-8">
            <div className="w-full">
              <UserForm onSubmit={handleUpdateUser} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserUpdateComponents;
