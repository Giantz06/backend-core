import "dotenv/config";
import { pool } from "./config/database.js";

const result = await pool.query("SELECT * FROM users");

console.log(result.rows);

await pool.end();
