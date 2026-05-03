import fs from "fs";
import { getConversationsDir, getConversationPath, ensureDataDir } from "./ensure";

interface Message {
  role: string;
  content: string;
  image?: string;
  timestamp: string;
}

interface ConversationMeta {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function createConversation(meta: ConversationMeta) {
  ensureDataDir();
  const filePath = getConversationPath(meta.id);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
  const metaPath = getConversationPath(`${meta.id}.meta`);
  fs.writeFileSync(metaPath, JSON.stringify(meta));
}

export function appendMessage(conversationId: string, message: Message) {
  const filePath = getConversationPath(conversationId);
  const line = JSON.stringify(message);
  fs.appendFileSync(filePath, line + "\n");
}

export function getMessages(conversationId: string): Message[] {
  const filePath = getConversationPath(conversationId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n").filter(Boolean);
  return lines.map((line) => JSON.parse(line) as Message);
}

export function getRecentMessages(conversationId: string, limit: number = 200): Message[] {
  const messages = getMessages(conversationId);
  return messages.slice(-limit);
}

export function listConversations(userId: string): ConversationMeta[] {
  ensureDataDir();
  const dir = getConversationsDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  const metas: ConversationMeta[] = [];
  for (const file of files) {
    if (file.endsWith(".meta")) {
      const content = fs.readFileSync(getConversationPath(file), "utf-8");
      const meta = JSON.parse(content) as ConversationMeta;
      if (meta.userId === userId) {
        metas.push(meta);
      }
    }
  }
  return metas.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getConversationMeta(conversationId: string): ConversationMeta | null {
  const metaPath = getConversationPath(`${conversationId}.meta`);
  if (!fs.existsSync(metaPath)) return null;
  const content = fs.readFileSync(metaPath, "utf-8");
  return JSON.parse(content) as ConversationMeta;
}

export function updateConversationTitle(conversationId: string, title: string) {
  const meta = getConversationMeta(conversationId);
  if (!meta) return;
  meta.title = title;
  meta.updatedAt = new Date().toISOString();
  const metaPath = getConversationPath(`${conversationId}.meta`);
  fs.writeFileSync(metaPath, JSON.stringify(meta));
}
