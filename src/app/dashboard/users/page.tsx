"use client";
import Tables from "@/components/dashboard/tables";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, User } from "@/hooks/data/useAuth";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { AlertDialogComponent } from "../../../components/dashboard/alert-modal";
import { UserModal } from "./create-user-modal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const UserComponents = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const { deleteUser, createUser, users } = useAuth(page, limit, debouncedSearch);
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: (row) => (
        <p className="break-all line-clamp-2 w-1/2">
          {row.row.original.username}
        </p>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UserModal user={row.row.original} onChange={updateUser} /> */}

          <AlertDialogComponent
            description="Are you sure you want to delete this user?"
            title="Confirm Deletion"
            onConfirm={() =>
              row.row.original.id && deleteUser(row.row.original.id)
            }
            onCancel={() => {}}
          />
        </div>
      ),
    },
    {
      id: "train-action",
      header: "Train data",
      cell: () => (
        <div className="flex gap-2">
          <Switch id="airplane-mode" />
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={[Role.Manager]}>
      <div>
        <div className="flex items-center gap-2 py-2 px-4">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search for a user"
              className="mr-4 w-full flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <UserModal onChange={createUser} />
          </div>
          <Tables
            onChange={(page) => {
              setPage(page);
            }}
            page={page}
            columns={columns}
            data={users ?? []}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserComponents;
