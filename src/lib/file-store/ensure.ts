import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONVERSATIONS_DIR = path.join(DATA_DIR, "conversations");

const FILES = {
  users: path.join(DATA_DIR, "users.jsonl"),
  sessions: path.join(DATA_DIR, "sessions.jsonl"),
  notes: path.join(DATA_DIR, "agent_memory.md"),
  compactState: path.join(DATA_DIR, ".compact_state"),
};

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONVERSATIONS_DIR)) {
    fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILES.users)) {
    fs.writeFileSync(FILES.users, "");
  }
  if (!fs.existsSync(FILES.sessions)) {
    fs.writeFileSync(FILES.sessions, "");
  }
  if (!fs.existsSync(FILES.notes)) {
    fs.writeFileSync(FILES.notes, "# Agent Memory\n\n");
  }
}

export function getFilePath(key: keyof typeof FILES) {
  return FILES[key];
}

export function getConversationsDir() {
  return CONVERSATIONS_DIR;
}

export function getConversationPath(id: string) {
  return path.join(CONVERSATIONS_DIR, `${id}.jsonl`);
}
