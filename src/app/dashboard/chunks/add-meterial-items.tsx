"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MaterialSelector } from "../meterials/components/material-selector";
import { MaterialItem } from "@/hooks/data/useKnowledge";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  materialId: z.string({
    required_error: "Please select a material.",
  }),
  text: z
    .string({
      required_error: "Please enter text.",
    })
    .optional(),
  url: z
    .string({
      required_error: "Please enter a URL.",
    })
    .optional(),
  file: z.instanceof(File).optional(),
});

interface AddMeterialProps {
  meterialItem?: MaterialItem;
  onChange: (data: MaterialItem) => void;
}

export function AddMeterialItemModal({
  onChange,
  meterialItem: meterial,
}: AddMeterialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (meterial) {
      form.setValue("materialId", String(meterial.materialId));
      form.setValue("text", meterial.text ?? "");
      form.setValue("url", meterial.url ?? "");
    } else {
      form.reset();
    }
  }, [meterial, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange({
      materialId: Number(data.materialId),
      text: data.text,
      url: data.url,
      file: data.file || undefined,
    });

    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>+ Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Add Material</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="materialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <MaterialSelector
                      value={field.value ?? ""}
                      className="w-full"
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <Textarea
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <Input
                      type="file"
                      className="w-full"
                      onChange={(e) =>
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
