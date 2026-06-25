import { neon } from "@neondatabase/serverless";
const sql = neon("postgresql://neondb_owner:npg_vUjSeR4MVH3a@ep-withered-dawn-aovonpwu-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
try {
  await sql`SELECT 1 as test`;
  console.log("Simple SELECT works");
  await sql.unsafe("SELECT 1 as test");
  console.log("unsafe SELECT works");
  const vec = [0.1, 0.2, 0.3];
  const vecStr = `[${vec.join(",")}]`;
  const q = `SELECT '${vecStr}'::vector as v`;
  console.log("Query:", q);
  const r = await sql.unsafe(q);
  console.log("Vector cast works:", JSON.stringify(r));
} catch (e) {
  console.error("Error:", e.message);
  console.error("Detail:", e.detail || "none");
}
