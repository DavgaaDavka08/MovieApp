import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MovieNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <p className="text-6xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">Энэ кино олдсонгүй</h1>
      <p className="text-muted-foreground">
        Линк буруу эсвэл кино түр хугацаанд хасагдсан байж магадгүй.
      </p>
      <Button asChild>
        <Link href="/movies">Бүх киног үзэх</Link>
      </Button>
    </div>
  );
}
