import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReport } from "@/hooks/data/useReport";

export function SectionCards() {
  const { tokenUsage, isFetchingTokenUsage } = useReport();
  const skeletonCard = (
    <Card>
      <CardHeader className="relative">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-24" />
      </CardHeader>
    </Card>
  );

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-2 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {isFetchingTokenUsage ? (
        <>
          {skeletonCard}
          {skeletonCard}
          {skeletonCard}
        </>
      ) : (
        <>
          <Card>
            <CardHeader className="relative">
              <CardDescription>Tổng cộng đã sử dụng</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {`${tokenUsage?.totalTokens ?? 0} token`}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="relative">
              <CardDescription>Output Token</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {`${tokenUsage?.totalOutputTokens ?? 0} token`}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="relative">
              <CardDescription>Input Token</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {`${tokenUsage?.totalInputTokens ?? 0} token`}
              </CardTitle>
            </CardHeader>
          </Card>
        </>
      )}
    </div>
  );
}
