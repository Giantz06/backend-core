import { pool } from "../config/database.js";

export async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, name, age, email FROM users"
  );

  return result.rows;
}

export async function getUserById(userId) {
  const result = await pool.query(
    "SELECT id, name, age, email FROM users WHERE id = $1",
    [userId]
  );

  if (!result.rows[0]) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return result.rows[0];
}

export async function updateUser(userId, data) {
  if (!validateUser(data)) {
    const err = new Error("Invalid user data");
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `UPDATE users
     SET name = $1, age = $2
     WHERE id = $3
     RETURNING id, name, age, email`,
    [data.name, data.age, userId]
  );

  if (result.rows.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return result.rows[0];
}

export async function deleteUser(userId) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [userId]
  );

  if (result.rows.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    message: "User deleted successfully",
  };
}

function validateUser(user) {
  return (
    typeof user.name === "string" &&
    user.name.trim() !== "" &&
    typeof user.age === "number" &&
    user.age > 0
  );
}
