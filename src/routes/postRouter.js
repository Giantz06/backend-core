import { sendJson } from "../utils/response.js";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

export async function postRouter(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "");
  // Route: /posts
  if (pathname === "/posts") {
    return handleCollection(req, res);
  }

  // Route: /posts/:id
  const match = pathname.match(/^\/posts\/([^/]+)$/);
  if (match) {
    return handleSinglePost(req, res, match[1]);
  }

  // Không khớp route nào
  sendJson(res, 404, { message: "Route not found" });
}

function handleCollection(req, res) {
  if (req.method === "GET") {
    return getPosts(req, res);
  }

  if (req.method === "POST") {
    return createPost(req, res);
  }

  sendJson(res, 405, { message: "Method not allowed" });
}

function handleSinglePost(req, res, rawId) {
  const postId = parsePostId(rawId);

  if (postId === null) {
    return sendJson(res, 400, { message: "Invalid post ID" });
  }

  if (req.method === "GET") {
    return getPost(req, res, postId);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    return updatePost(req, res, postId);
  }

  if (req.method === "DELETE") {
    return deletePost(req, res, postId);
  }

  sendJson(res, 405, { message: "Method not allowed" });
}

function parsePostId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }
  return parseInt(value, 10);
}