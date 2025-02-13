"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkKnowLedge, MaterialItem } from "@/hooks/data/useKnowledge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  url: z.string({
    required_error: "Please enter a URL.",
  }),
});

interface AddMeterialProps {
  meterialItem?: MaterialItem;
  onChange: ({ url }: LinkKnowLedge) => void;
}

export function LinkModal({ onChange }: AddMeterialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange(data as LinkKnowLedge);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link modal</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <Input
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormItem>
                )}
              />

              <div className="w-full flex gap-4">
                <Button
                  type="submit"
                  className="w-full bg-white text-black border"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
