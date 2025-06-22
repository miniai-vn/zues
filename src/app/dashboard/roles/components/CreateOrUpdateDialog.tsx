"use client";

import { useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/hooks/useTranslations";

export interface RoleData {
  id?: number;
  name: string;
  description: string;
}

interface CreateOrUpdateRoleDialogProps {
  role?: RoleData;
  onChange?: (data: RoleData) => void;
  children?: React.ReactNode;
}

export function CreateOrUpdateRoleDialog({
  role,
  onChange,
  children,
}: CreateOrUpdateRoleDialogProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const roleSchema = z.object({
    name: z
      .string()
      .nonempty(t("dashboard.roles.modal.validation.nameRequired")),
    description: z
      .string()
      .nonempty(t("dashboard.roles.modal.validation.descriptionRequired")),
  });

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof roleSchema>) => {
    onChange?.({
      ...data,
      id: role?.id,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      {" "}
      <DialogTrigger asChild>
        {children || <Button>{t("dashboard.roles.add")}</Button>}
      </DialogTrigger>
      <DialogContent className="w-[400px] max-w-full">
        <DialogHeader>
          <DialogTitle>
            {role
              ? t("dashboard.roles.modal.editTitle")
              : t("dashboard.roles.modal.createTitle")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.roles.name")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("dashboard.roles.modal.namePlaceholder")}
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("dashboard.roles.description")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(
                      "dashboard.roles.modal.descriptionPlaceholder"
                    )}
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />{" "}
            <div className="w-full flex justify-end">
              <Button type="submit">
                {role
                  ? t("dashboard.roles.modal.updateButton")
                  : t("dashboard.roles.modal.createButton")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrUpdateRoleDialog;
