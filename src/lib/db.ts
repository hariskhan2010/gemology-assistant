import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL!);
  }
  return sql;
}

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface DbSession {
  token: string;
  user_id: string;
  email: string;
  name: string;
  expires_at: string;
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      expires_at TEXT NOT NULL
    )
  `;
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] as DbUser | null;
}

export async function createUser(user: DbUser) {
  const sql = getSql();
  await sql`
    INSERT INTO users (id, email, password_hash, name, created_at)
    VALUES (${user.id}, ${user.email}, ${user.password_hash}, ${user.name}, ${user.created_at})
  `;
}

export async function createSession(session: DbSession) {
  const sql = getSql();
  await sql`
    INSERT INTO sessions (token, user_id, email, name, expires_at)
    VALUES (${session.token}, ${session.user_id}, ${session.email}, ${session.name}, ${session.expires_at})
  `;
}

export async function findSessionByToken(token: string): Promise<DbSession | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM sessions WHERE token = ${token} LIMIT 1`;
  return rows[0] as DbSession | null;
}

export async function deleteSession(token: string) {
  const sql = getSql();
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}
