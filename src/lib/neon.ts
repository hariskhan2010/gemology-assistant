import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export { sql };

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  reset_token?: string;
  reset_expires?: string;
}

export interface DbSession {
  token: string;
  user_id: string;
  email: string;
  name: string;
  expires_at: string;
}

export interface DbConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  image?: string;
  timestamp: string;
}

export interface DbNote {
  id: string;
  content: string;
  created_at: string;
}

export interface DbSavedGem {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image: string | null;
  properties: string | null;
  created_at: string;
}

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      reset_token TEXT,
      reset_expires TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      expires_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      timestamp TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS saved_gems (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      image TEXT,
      properties TEXT DEFAULT '{}',
      created_at TEXT NOT NULL
    )
  `;
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  return result[0] as DbUser | null;
}

export async function findUserById(id: string): Promise<DbUser | null> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result[0] as DbUser | null;
}

export async function createUser(user: DbUser): Promise<void> {
  await sql`
    INSERT INTO users (id, email, password_hash, name, created_at, reset_token, reset_expires)
    VALUES (${user.id}, ${user.email}, ${user.password_hash}, ${user.name}, ${user.created_at}, ${user.reset_token || null}, ${user.reset_expires || null})
  `;
}

export async function updateUser(filter: Partial<DbUser>, update: any): Promise<void> {
  const sets: string[] = [];
  
  if (update.reset_token !== undefined) {
    sets.push(`reset_token = '${update.reset_token}'`);
  }
  if (update.reset_expires !== undefined) {
    sets.push(`reset_expires = '${update.reset_expires}'`);
  }
  if (update.password_hash !== undefined) {
    sets.push(`password_hash = '${update.password_hash}'`);
  }
  if (update.name !== undefined) {
    sets.push(`name = '${update.name}'`);
  }
  
  const whereClauses: string[] = [];
  if (filter.email) {
    whereClauses.push(`email = '${filter.email}'`);
  }
  if (filter.id) {
    whereClauses.push(`id = '${filter.id}'`);
  }
  
  if (sets.length > 0) {
    await sql`UPDATE users SET ${sql.unsafe(sets.join(', '))} WHERE ${sql.unsafe(whereClauses.join(' AND '))}`;
  }
}

export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE user_id = ${id}`;
  await sql`DELETE FROM conversations WHERE user_id = ${id}`;
  await sql`DELETE FROM users WHERE id = ${id}`;
}

export async function findUserByResetToken(token: string): Promise<DbUser | null> {
  const result = await sql`SELECT * FROM users WHERE reset_token = ${token} AND reset_expires > ${new Date().toISOString()}`;
  return result[0] as DbUser | null;
}

export async function createSession(session: DbSession): Promise<void> {
  await sql`
    INSERT INTO sessions (token, user_id, email, name, expires_at)
    VALUES (${session.token}, ${session.user_id}, ${session.email}, ${session.name}, ${session.expires_at})
  `;
}

export async function findSessionByToken(token: string): Promise<DbSession | null> {
  const result = await sql`SELECT * FROM sessions WHERE token = ${token}`;
  return result[0] as DbSession | null;
}

export async function deleteSession(token: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

export async function getConversationsByUserId(user_id: string): Promise<DbConversation[]> {
  return await sql`SELECT * FROM conversations WHERE user_id = ${user_id} ORDER BY updated_at DESC` as DbConversation[];
}

export async function createConversation(conversation: DbConversation): Promise<void> {
  await sql`
    INSERT INTO conversations (id, user_id, title, created_at, updated_at)
    VALUES (${conversation.id}, ${conversation.user_id}, ${conversation.title}, ${conversation.created_at}, ${conversation.updated_at})
  `;
}

export async function updateConversation(id: string, updates: Partial<DbConversation>): Promise<void> {
  const sets: string[] = [];
  if (updates.title) sets.push(`title = '${updates.title}'`);
  if (updates.updated_at) sets.push(`updated_at = '${updates.updated_at}'`);
  
  await sql`UPDATE conversations SET ${sql.unsafe(sets.join(', '))} WHERE id = ${id}`;
}

export async function deleteConversation(id: string): Promise<void> {
  await sql`DELETE FROM messages WHERE conversation_id = ${id}`;
  await sql`DELETE FROM conversations WHERE id = ${id}`;
}

export async function getMessagesByConversationId(conversation_id: string): Promise<DbMessage[]> {
  return await sql`SELECT * FROM messages WHERE conversation_id = ${conversation_id} ORDER BY timestamp ASC` as DbMessage[];
}

export async function createMessage(message: DbMessage): Promise<void> {
  await sql`
    INSERT INTO messages (id, conversation_id, role, content, image, timestamp)
    VALUES (${message.id}, ${message.conversation_id}, ${message.role}, ${message.content}, ${message.image || null}, ${message.timestamp})
  `;
}

export async function getNotes(): Promise<DbNote[]> {
  return await sql`SELECT * FROM notes ORDER BY created_at DESC` as DbNote[];
}

export async function createNote(note: DbNote): Promise<void> {
  await sql`
    INSERT INTO notes (id, content, created_at)
    VALUES (${note.id}, ${note.content}, ${note.created_at})
  `;
}

export async function deleteNote(id: string): Promise<void> {
  await sql`DELETE FROM notes WHERE id = ${id}`;
}

export async function createSavedGem(gem: DbSavedGem): Promise<void> {
  await sql`
    INSERT INTO saved_gems (id, user_id, name, description, image, properties, created_at)
    VALUES (${gem.id}, ${gem.user_id}, ${gem.name}, ${gem.description}, ${gem.image || null}, ${gem.properties || null}, ${gem.created_at})
  `;
}

export async function getSavedGemsByUserId(user_id: string): Promise<DbSavedGem[]> {
  return await sql`SELECT * FROM saved_gems WHERE user_id = ${user_id} ORDER BY created_at DESC` as DbSavedGem[];
}

export async function deleteSavedGem(id: string): Promise<void> {
  await sql`DELETE FROM saved_gems WHERE id = ${id}`;
}
