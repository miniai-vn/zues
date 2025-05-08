"use client";
import { UserForm, UserUpdateFormValues } from "@/components/dashboard/user-update-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, useUserStore } from "@/hooks/data/useAuth";

const UserUpdateComponents = () => {
  const { updateUser } = useAuth({});
  const { user } = useUserStore();

  const handleUpdateUser = async (data: UserUpdateFormValues) => {
    try {
      await updateUser({...data, id: user?.id});
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <ProtectedRoute requiredRole={[Role.Manager]}>
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center gap-2 py-3 px-4 bg-white border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Manager</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
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