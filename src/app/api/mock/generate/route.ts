import { NextResponse } from "next/server";
import { createPersonalizedUtmeMock } from "@/lib/actions/mock";

export async function POST() {
  try {
    const mock = await createPersonalizedUtmeMock();

    return NextResponse.json({
      ok: true,
      mockExamId: mock.id,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create mock exam.";

    const status =
      message === "Basira Pro is required for this feature." ? 403 : 400;

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status },
    );
  }
}
