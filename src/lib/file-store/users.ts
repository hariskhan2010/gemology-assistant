import fs from "fs";
import { randomUUID } from "crypto";
import { getFilePath, ensureDataDir } from "./ensure";

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export function createUser(user: User) {
  ensureDataDir();
  const line = JSON.stringify(user);
  fs.appendFileSync(getFilePath("users"), line + "\n");
}

export function findUserByEmail(email: string): User | null {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("users"), "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const entry = JSON.parse(lines[i]) as User;
    if (entry.email === email) {
      if (!entry.id) {
        entry.id = randomUUID();
      }
      return entry;
    }
  }
  return null;
}

export function deduplicateUsers() {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("users"), "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  const seen = new Map<string, string>();
  for (const line of lines) {
    const entry = JSON.parse(line) as User;
    seen.set(entry.email, line);
  }
  const deduped = Array.from(seen.values());
  fs.writeFileSync(getFilePath("users"), deduped.join("\n") + (deduped.length ? "\n" : ""));
}
