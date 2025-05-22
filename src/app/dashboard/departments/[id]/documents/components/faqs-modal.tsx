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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  question: z.string({
    required_error: "Please enter a question.",
  }),
  answer: z.string({
    required_error: "Please enter an answer.",
  }),
});

interface FaqsModalProps {
  faq?: { id?: string; question: string; answer: string };
  children?: React.ReactNode;
  onChange: (data: { id?: string; question: string; answer: string }) => void;
}

export function FaqsModal({ faq, onChange, children }: FaqsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: faq || { question: "", answer: "" },
  });

  useEffect(() => {
    if (faq) {
      form.reset(faq);
    }
  }, [faq, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange({ ...data, id: faq?.id });
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
        {children || <Button>{faq ? "Edit FAQ" : "+ Tạo"}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Chỉnh sửa FAQ" : "Tạo FAQ"}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
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
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <Textarea
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full h-40"
                    />
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-4">
                <Button
                  type="button"
                  className="w-full bg-white text-black border"
                  onClick={() => setIsOpen(false)}
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
