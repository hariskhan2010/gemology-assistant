import fs from "fs";
import { getFilePath, getConversationsDir, getConversationPath, ensureDataDir } from "./ensure";
import { deduplicateUsers } from "./users";
import { cleanupExpiredSessions } from "./sessions";

const SIZE_THRESHOLD = 2 * 1024 * 1024; // 2MB
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CONVERSATION_MESSAGES = 200;
const MAX_NOTES = 500;

interface CompactState {
  lastCompact: string;
  fileSizes: Record<string, number>;
}

function getCompactState(): CompactState {
  const path = getFilePath("compactState");
  if (!fs.existsSync(path)) return { lastCompact: "0", fileSizes: {} };
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch {
    return { lastCompact: "0", fileSizes: {} };
  }
}

function saveCompactState(state: CompactState) {
  fs.writeFileSync(getFilePath("compactState"), JSON.stringify(state));
}

function getFileSize(filePath: string): number {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

function shouldCompact(): boolean {
  const state = getCompactState();
  const elapsed = Date.now() - new Date(state.lastCompact).getTime();
  return elapsed >= COOLDOWN_MS;
}

function checkAndCompactFile(filePath: string, compactFn: () => void) {
  const size = getFileSize(filePath);
  if (size >= SIZE_THRESHOLD) {
    compactFn();
    return true;
  }
  return false;
}

function compactConversation(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  if (lines.length <= MAX_CONVERSATION_MESSAGES) return;

  const keep = [...lines.slice(0, 3), ...lines.slice(-MAX_CONVERSATION_MESSAGES + 3)];
  const summary = JSON.stringify({
    role: "system",
    content: "[Older messages were removed during auto-compact to save space]",
    timestamp: new Date().toISOString(),
  });
  const compacted = [summary, ...keep];
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, compacted.join("\n") + "\n");
  fs.renameSync(tmpPath, filePath);
}

function compactNotes() {
  const path = getFilePath("notes");
  const content = fs.readFileSync(path, "utf-8");
  const lines = content.split("\n");
  const noteLines = lines.filter((l) => l.trim().startsWith("- ["));
  if (noteLines.length <= MAX_NOTES) return;

  const header = lines.find((l) => l.trim() === "# Agent Memory") || "# Agent Memory";
  const active = noteLines.slice(-MAX_NOTES);
  const archived = noteLines.slice(0, -MAX_NOTES);

  const tmpPath = path + ".tmp";
  fs.writeFileSync(tmpPath, header + "\n\n" + active.join("\n") + "\n");
  fs.renameSync(tmpPath, path);

  const archivePath = path.replace(".md", "_archived.md");
  fs.appendFileSync(archivePath, archived.join("\n") + "\n");
}

export function autoCompact() {
  if (!shouldCompact()) return;

  ensureDataDir();

  deduplicateUsers();
  cleanupExpiredSessions();

  checkAndCompactFile(getFilePath("users"), deduplicateUsers);
  checkAndCompactFile(getFilePath("sessions"), cleanupExpiredSessions);

  const convDir = getConversationsDir();
  if (fs.existsSync(convDir)) {
    const files = fs.readdirSync(convDir);
    for (const file of files) {
      if (file.endsWith(".jsonl")) {
        const filePath = getConversationPath(file);
        checkAndCompactFile(filePath, () => compactConversation(filePath));
      }
    }
  }

  checkAndCompactFile(getFilePath("notes"), compactNotes);

  const state: CompactState = {
    lastCompact: new Date().toISOString(),
    fileSizes: {},
  };
  state.fileSizes["users.jsonl"] = getFileSize(getFilePath("users"));
  state.fileSizes["sessions.jsonl"] = getFileSize(getFilePath("sessions"));
  state.fileSizes["agent_memory.md"] = getFileSize(getFilePath("notes"));
  saveCompactState(state);
}
