"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useRoles, {
  Permission,
  PermissionVietnameseNames,
  Role,
  PermissionGroupVietnameseNames,
  RoleVietnameseNames,
} from "@/hooks/data/useRoles";
import { useTranslations } from "@/hooks/useTranslations";
import React, { useCallback, useEffect, useState } from "react";
import { Shield, Save, AlertCircle } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const PermissionsRoles = () => {
  const { t } = useTranslations();
  const params = useParams();
  const id = params?.id as string | undefined;

  // Get permissions from the main hook
  const { permissions, isLoading } = usePermissions();

  // Get single role data using the hook's useRoleById function
  const { useRoleById, updateRole } = useRoles({});
  const {
    data: roleWithFullPermissions,
    isLoading: isLoadingRole,
    error: roleError,
  } = useRoleById(id!);

  // Local state for editing
  const [displayRole, setDisplayRole] = useState<Role | null>(null);
  const [displayPermissions, setDisplayPermissions] = useState<
    Array<[string, Permission[]]>
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Set initial role data when loaded - with default all permissions if empty
  useEffect(() => {
    if (roleWithFullPermissions && permissions && permissions.length > 0) {
      // Check if role has no permissions or permissions is empty
      const hasPermissions =
        roleWithFullPermissions.permissions &&
        roleWithFullPermissions.permissions.length > 0;

      if (!hasPermissions) {
        // If no permissions, default to all permissions selected
        setDisplayRole({
          ...roleWithFullPermissions,
          permissions: [...permissions], // Clone all permissions
        });
        setHasChanges(true); // Mark as changed since we're defaulting to all
      } else {
        setDisplayRole(roleWithFullPermissions);
        setHasChanges(false);
      }
    }
  }, [roleWithFullPermissions, permissions]);

  // Group permissions by category
  useEffect(() => {
    if (permissions) {
      const displayPermissions = new Map<string, Permission[]>();
      permissions.forEach((permission) => {
        const group = permission.code.split(".")[0];
        if (!displayPermissions.has(group)) {
          displayPermissions.set(group, []);
        }
        displayPermissions.get(group)?.push(permission);
      });
      setDisplayPermissions(Array.from(displayPermissions));
    }
  }, [permissions]);

  const handlePermissionChange = (permission: Permission, check: boolean) => {
    if (!displayRole) return;

    let newPermissions = [...displayRole.permissions];

    if (check) {
      // Add permission if not already present
      const exists = newPermissions.some((p) => p.code === permission.code);
      if (!exists) {
        newPermissions.push({
          ...permission,
          code: permission.code,
          name: permission.name,
          description: permission.description,
          id: permission.id,
        });
      }
    } else {
      // Remove the permission if it exists
      newPermissions = newPermissions.filter((p) => p.code !== permission.code);
    }

    setDisplayRole({
      ...displayRole,
      permissions: newPermissions,
    });

    setHasChanges(true);
  };

  // Helper function to select/deselect all permissions
  const handleSelectAllPermissions = (selectAll: boolean) => {
    if (!displayRole || !permissions) return;

    const newPermissions = selectAll ? [...permissions] : [];

    setDisplayRole({
      ...displayRole,
      permissions: newPermissions,
    });
    setHasChanges(true);
  };

  // Helper function to check if all permissions are selected
  const areAllPermissionsSelected = () => {
    if (!displayRole || !permissions || permissions.length === 0) return false;

    return permissions.every((permission) =>
      displayRole.permissions.some((p) => p.code === permission.code)
    );
  };

  // Helper function to check if some permissions are selected
  const areSomePermissionsSelected = () => {
    if (!displayRole || !permissions || permissions.length === 0) return false;

    return (
      permissions.some((permission) =>
        displayRole.permissions.some((p) => p.code === permission.code)
      ) && !areAllPermissionsSelected()
    );
  };

  const handleSaveChanges = useCallback(async () => {
    if (!displayRole || !id) return;
    try {
      await updateRole({
        id: id,
        data: displayRole,
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  }, [displayRole, id, updateRole]);

  // Loading state
  if (isLoadingRole || isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center space-x-4 pl-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (roleError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load role data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No role found
  if (!displayRole) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Role not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("dashboard.roles.detail.title")} - {displayRole.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {displayRole.description ||
                  t("dashboard.roles.detail.subtitle")}
              </p>
            </div>
            {hasChanges && (
              <Button
                onClick={handleSaveChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t("dashboard.roles.detail.saveChanges")}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Select All / Deselect All Controls */}
          <div className="mb-4 flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={areAllPermissionsSelected()}
                onCheckedChange={(checked) =>
                  handleSelectAllPermissions(checked as boolean)
                }
              />
              <label className="text-sm font-medium">
                {areAllPermissionsSelected()
                  ? "Deselect All Permissions"
                  : "Select All Permissions"}
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              {displayRole.permissions?.length || 0} of{" "}
              {permissions?.length || 0} permissions selected
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    {t("dashboard.roles.detail.permissionsColumn")}
                  </TableHead>
                  <TableHead className="text-center w-[200px]">
                    {displayRole
                      ? RoleVietnameseNames[displayRole.name] ||
                        displayRole.name
                      : ""}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayPermissions.map(([group, groupPermissions]) => (
                  <React.Fragment key={group}>
                    {/* Group header row */}
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="bg-muted/50 font-semibold text-primary uppercase py-3"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          {PermissionGroupVietnameseNames[group] || group}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Permission rows */}
                    {groupPermissions.map((permission) => (
                      <TableRow
                        key={permission.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="font-medium pl-8">
                          <div>
                            <div className="font-medium">
                              {PermissionVietnameseNames[permission.code] ||
                                permission.name}
                            </div>
                            {permission.description && (
                              <div className="text-xs text-muted-foreground">
                                {permission.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={
                              !!displayRole?.permissions?.some(
                                (p: any) => p.code === permission.code
                              )
                            }
                            onCheckedChange={(check: boolean) =>
                              handlePermissionChange(permission, check)
                            }
                            className="mx-auto"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {hasChanges && (
            <div className="mt-6 flex justify-between items-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                You have unsaved changes
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (roleWithFullPermissions) {
                      setDisplayRole(roleWithFullPermissions);
                      setHasChanges(false);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsRoles;
