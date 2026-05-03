import fs from "fs";
import { getFilePath, ensureDataDir } from "./ensure";

interface Session {
  token: string;
  userId: string;
  email: string;
  name: string;
  expiresAt: string;
}

export function createSession(session: Session) {
  ensureDataDir();
  const line = JSON.stringify(session);
  fs.appendFileSync(getFilePath("sessions"), line + "\n");
}

export function findSession(token: string): Session | null {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("sessions"), "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  const now = new Date();
  for (const line of lines) {
    const entry = JSON.parse(line) as Session;
    if (entry.token === token && new Date(entry.expiresAt) > now) {
      return entry;
    }
  }
  return null;
}

export function invalidateSession(token: string) {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("sessions"), "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  const filtered = lines.filter((line) => {
    const entry = JSON.parse(line) as Session;
    return entry.token !== token;
  });
  fs.writeFileSync(getFilePath("sessions"), filtered.join("\n") + (filtered.length ? "\n" : ""));
}

export function cleanupExpiredSessions() {
  ensureDataDir();
  const content = fs.readFileSync(getFilePath("sessions"), "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  const now = new Date();
  const active = lines.filter((line) => {
    const entry = JSON.parse(line) as Session;
    return new Date(entry.expiresAt) > now;
  });
  fs.writeFileSync(getFilePath("sessions"), active.join("\n") + (active.length ? "\n" : ""));
}
