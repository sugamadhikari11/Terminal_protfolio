import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Example API route — ready for full-stack features later */
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    ok: true,
    service: "terminal-portfolio",
    message: "API is ready. Add routes under src/app/api as needed.",
  });
}
