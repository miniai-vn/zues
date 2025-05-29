"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDomain from "@/hooks/data/useDomain";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function LinkDataSourceComponent() {
  const [appId, setAppId] = useState("");
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
    if (!appId.trim()) return;
    createDomain({ domain: appId });
    setAppId("");
  };

  const handleDelete = () => {
    if (domain && domain.id) {
      deleteDomain(domain.id);
    }
  };

  useEffect(() => {
    if (domain) {
      return setAppId(domain.domain);
    } else setAppId("");
  }, [domain]);
  return (
    <div className="w-full">
      <Card className="border rounded-lg shadow-sm">
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Liên kết dữ liệu vào miniapp
          </p>
          <div className="flex w-full mt-4">
            <Input
              className="rounded-l-md rounded-r-none border-r-0 flex-grow focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập zalo app Id"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
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
                "Hủy liên kết"
              ) : (
                "Xác nhận"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
