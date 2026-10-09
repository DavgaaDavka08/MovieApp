import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-12 sm:px-6">
      <Skeleton className="h-6 w-40 rounded-full" />
      <Skeleton className="h-14 w-2/3 rounded-lg" />
      <Skeleton className="h-5 w-1/2 rounded-full" />
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  );
}
