import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MovieNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-display text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Энэ кино олдсонгүй</h1>
      <p className="text-muted-foreground">
        Линк буруу эсвэл кино түр хугацаанд хасагдсан байж магадгүй. Бусад кинонуудаас сонгоорой.
      </p>
      <Button asChild size="lg">
        <Link href="/movies">Бүх киног үзэх</Link>
      </Button>
    </div>
  );
}
