"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDomain from "@/hooks/data/useDomain";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function DomainComponent() {
  const [domainName, setDomainName] = useState("");
  const { domain, createDomain, deleteDomain, isPendingCreateDomain } =
    useDomain({});

  const handleClick = () => {
    if (domain) {
      handleDelete();
    } else {
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (!domainName.trim()) return;
    createDomain({ domain: domainName });
    setDomainName("");
  };

  const handleDelete = () => {
    if (domain && domain.id) {
      deleteDomain(domain.id);
    }
  };

  useEffect(() => {
    if (domain) {
      return setDomainName(domain.domain);
    } else setDomainName("");
  }, [domain]);
  return (
    <div className="w-full">
      <Card className="border rounded-lg shadow-sm">
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Tạo một phần đang đọc dạo trên web với tên miền tùy chỉnh. Kết nối
            tên miền hiện có của bạn với nền tảng của chúng tôi để có giao diện
            chuyên nghiệp giúp bạn nổi bật.
          </p>
          <div className="flex w-full mt-4">
            <Input
              className="rounded-l-md rounded-r-none border-r-0 flex-grow focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên miền, ví dụ: app.mi9.ai"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              disabled={isPendingCreateDomain}
            />
            <Button
              className="rounded-r-md rounded-l-none bg-blue-500 hover:bg-blue-600 font-semibold px-6"
              onClick={handleClick}
              disabled={isPendingCreateDomain || !!domain}
            >
              {isPendingCreateDomain ? (
                <ReloadIcon className="animate-spin" />
              ) : domain ? (
                "Xóa"
              ) : (
                "Tạo"
              )}
            </Button>
          </div>
          {domain && (
            <div className="flex w-full mt-4">
              <Badge
                className={`${
                  domain?.dnsVerified
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                }`}
              >
                {domain?.dnsVerified ? (
                  "Đã xác minh"
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertCircleIcon className="" /> Đang xác minh
                  </span>
                )}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
