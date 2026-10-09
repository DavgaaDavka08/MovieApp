import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-5 py-24 text-center">
      <p className="text-6xl font-bold">404</p>
      <h1 className="text-2xl font-semibold">Хуудас олдсонгүй</h1>
      <Button asChild>
        <Link href="/">Нүүр хуудас руу буцах</Link>
      </Button>
    </div>
  );
}
