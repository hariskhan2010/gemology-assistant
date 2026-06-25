import { NextResponse } from "next/server";
import { seedKnowledge, clearKnowledge, getStats } from "@/lib/knowledge/rag";
import { readFileSync } from "fs";
import { join } from "path";

const DOCS = [
  "gemological-reference-data.md",
  "extended-gemstone-data.md",
  "gemstone-treatment-detection.md",
  "synthetic-gemstone-identification.md",
  "gemstone-care-and-durability.md",
  "advanced-gemological-techniques.md",
];

export async function POST() {
  try {
    await clearKnowledge();
    let total = 0, success = 0;
    for (const file of DOCS) {
      const filePath = join(process.cwd(), "docs", file);
      const markdown = readFileSync(filePath, "utf-8");
      const result = await seedKnowledge(file, markdown);
      total += result.total;
      success += result.success;
      console.log(`Seeded ${file}: ${result.success}/${result.total} chunks`);
    }
    return NextResponse.json({
      message: "Knowledge base seeded successfully",
      documents: DOCS.length,
      total,
      success,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error?.message || "Seed failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to get stats" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearKnowledge();
    return NextResponse.json({ message: "Knowledge base cleared" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to clear" },
      { status: 500 }
    );
  }
}
