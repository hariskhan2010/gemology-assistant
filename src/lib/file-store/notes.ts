import fs from "fs";
import { getFilePath, ensureDataDir } from "./ensure";

export function addNote(content: string) {
  ensureDataDir();
  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").slice(0, 16);
  const noteLine = `- [${timestamp}] ${content}`;
  const existing = getNotes();
  for (const note of existing) {
    if (note.toLowerCase().includes(content.toLowerCase())) {
      return false;
    }
  }
  const file = getFilePath("notes");
  const fileContent = fs.readFileSync(file, "utf-8");
  if (fileContent.trim().endsWith("# Agent Memory")) {
    fs.appendFileSync(file, "\n\n" + noteLine + "\n");
  } else {
    fs.appendFileSync(file, noteLine + "\n");
  }
  return true;
}

export function getNotes(): string[] {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("notes"), "utf-8");
  const lines = content.split("\n");
  return lines
    .filter((line) => line.trim().startsWith("- ["))
    .map((line) => line.replace(/^- \[.*?\] /, ""));
}

export function getNotesWithTimestamps(): { timestamp: string; content: string }[] {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("notes"), "utf-8");
  const lines = content.split("\n");
  const notes: { timestamp: string; content: string }[] = [];
  for (const line of lines) {
    const match = line.trim().match(/^- \[(.*?)\] (.+)$/);
    if (match) {
      notes.push({ timestamp: match[1], content: match[2] });
    }
  }
  return notes;
}
