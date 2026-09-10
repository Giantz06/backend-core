import { pool } from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUser(data) {
  if (!validateUser(data)) {
    const err = new Error("Cannot register user. Invalid data.");
    err.statusCode = 400;
    throw err;
  }
  const mail = data.email.trim().toLowerCase();
  const name = data.name.trim();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, age, email, password_hash)
   VALUES ($1, $2, $3, $4)
   RETURNING id, name, age, email`,
    [name, data.age, mail, passwordHash]
  );
  return result.rows[0];
}

export async function loginUser(data) {
  if (!data.email || !data.password) {
    const err = new Error("Email and password are required.");
    err.statusCode = 400;
    throw err;
  }

  const mail = data.email.trim().toLowerCase();
  const result = await pool.query(
    `SELECT id, name, age, email, password_hash FROM users WHERE email = $1`,
    [mail]
  );

  if (result.rows.length === 0) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(data.password, user.password_hash);

  if (!isMatch) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "0.5h" }
  );

  return { token, user: { id: user.id, name: user.name, age: user.age, email: user.email } };
}

function validateUser(user) {
  return (
    typeof user.name === "string" &&
    user.name.trim() !== "" &&
    typeof user.age === "number" &&
    user.age > 0
    && typeof user.password === "string" && user.password.trim() !== "" && user.password.length >= 6
    && typeof user.email === "string" && user.email.trim() !== ""
    && validateEmail(user.email)
  );
}
function validateEmail(email) {
  // Regex chuẩn kiểm tra cấu trúc cơ bản: username@domain.extension
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(String(email).trim());
}