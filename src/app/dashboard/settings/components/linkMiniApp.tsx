"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useShopSettings from "@/hooks/data/useShopSettings";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function LinkDataSourceComponent() {
  const [appId, setAppId] = useState("");
  const {
    shop,
    updateZaloId,
    isLoadingShop: isPendingUpdateZaloId,
    syncDataShop,
    isSyncingDataShop,
  } = useShopSettings();

  const handleClick = () => {
    if (shop?.zaloId) {
      handleDelete();
    } else {
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (!appId.trim()) return;
    updateZaloId(appId);
    setAppId("");
  };

  const handleDelete = () => {
    // Xóa zaloId bằng cách gửi chuỗi rỗng
    updateZaloId("");
    setAppId("");
  };

  useEffect(() => {
    if (shop?.zaloId) {
      setAppId(shop.zaloId);
    } else {
      setAppId("");
    }
  }, [shop?.zaloId]);

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
              disabled={isPendingUpdateZaloId}
            />
            <Button
              className="rounded-r-md rounded-l-none bg-blue-500 hover:bg-blue-600 font-semibold px-6"
              onClick={handleClick}
              disabled={isPendingUpdateZaloId}
            >
              {isPendingUpdateZaloId ? (
                <ReloadIcon className="animate-spin" />
              ) : shop?.zaloId ? (
                "Hủy liên kết"
              ) : (
                "Xác nhận"
              )}
            </Button>
          </div>
          {shop?.zaloId && (
            <div className="mt-2 flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Đã liên kết với Zalo App ID: <strong>{shop.zaloId}</strong>
              </p>
              <Button
                className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  syncDataShop();
                }}
                disabled={isSyncingDataShop}
              >
                {isSyncingDataShop ? (
                  <ReloadIcon className="animate-spin" />
                ) : (
                  "Đồng bộ sản phẩm"
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
