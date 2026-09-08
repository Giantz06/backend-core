import { pool } from "../config/database.js";

export async function getAllPosts() {
  const result = await pool.query(`
        SELECT
            posts.id,
            posts.title,
            posts.user_id,
            users.name AS author
        FROM posts
        JOIN users
            ON posts.user_id = users.id;
    `);

  return result.rows;
}

export async function getPostById(postId) {
  const result = await pool.query(
    `SELECT
            posts.id,
            posts.title,
            posts.user_id,
            users.name AS author
        FROM posts
        JOIN users
            ON posts.user_id = users.id
        WHERE posts.id = $1`,
    [postId]
  );

  if (!result.rows[0]) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return result.rows[0];
}

export async function createPost(data) {
  if (!validatePost(data)) {
    const err = new Error("Invalid post data");
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    "INSERT INTO posts (title, user_id) VALUES ($1, $2) RETURNING *",
    [data.title, data.user_id]
  );

  return result.rows[0];
}

export async function updatePost(postId, data) {
  if (!validatePost(data)) {
    const err = new Error("Invalid post data");
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `UPDATE posts
     SET title = $1, user_id = $2
     WHERE id = $3
     RETURNING *`,
    [data.title, data.user_id, postId]
  );

  if (result.rows.length === 0) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return result.rows[0];
}

export async function deletePost(postId) {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [postId]
  );

  if (result.rows.length === 0) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return {
    message: "Post deleted successfully",
  };
}

function validatePost(post) {
  return (
    typeof post.title === "string" &&
    post.title.trim() !== "" &&
    typeof post.user_id === "number" &&
    Number.isInteger(post.user_id)
  );
}
