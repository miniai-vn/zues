"use client";
import Tables from "@/components/dashboard/tables";
import { LoadingSpinner } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FAQs, useFAQs } from "@/hooks/data/useFAQs";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { FaqsModal } from "./faqs-modal";
import { useState } from "react";
import { AlertDialogComponent } from "@/components/dashboard/alert-modal";

const FAQsComponent = () => {
  const [search] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { faqs, isLoadingFAQs, createFAQ, updateFAQ, deleteFAQ } = useFAQs({
    page,
    limit,
    search,
  });

  const columns: ColumnDef<FAQs>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original?.question}
          </div>
        );
      },
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {row.row.original?.answer}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Update At",
      cell: (row) => {
        return (
          <div className="break-all line-clamp-2 w-1/2">
            {dayjs(row.row.original.updatedAt).format("DD/MM/YYYY")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex gap-2">
            <Badge
              onClick={() => {
                const faq = row.row.original;
                updateFAQ({
                  id: faq.id!,
                  question: faq.question,
                  answer: faq.answer,
                });
              }}
            >
              Update
            </Badge>

            <AlertDialogComponent
              description="
                        Do you want to delete this faq?"
              title="Confirm delete"
              onConfirm={() =>
                row.row.original.id && deleteFAQ(row.row.original.id)
              }
              onCancel={() => {}}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by question"
          className="mr-4 w-full flex-1"
        />
        <FaqsModal onChange={createFAQ} />
      </div>
      {isLoadingFAQs ? (
        <LoadingSpinner />
      ) : (
        <Tables
          page={page}
          onChange={(value) => setPage(value)}
          columns={columns}
          data={faqs ?? []}
        />
      )}
    </div>
  );
};

export default FAQsComponent;
