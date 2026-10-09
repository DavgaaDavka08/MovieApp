import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/movies";

/** Header-ийн шуурхай хайлт. TMDB токеныг клиент рүү ил гаргахгүйн тулд сервер дээр дуудна. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ results: [] });
  const { results } = await searchMovies(q);
  return NextResponse.json(
    { results: results.slice(0, 6) },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
