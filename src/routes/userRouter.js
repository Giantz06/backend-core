import { sendJson } from "../utils/response.js";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

export async function userRouter(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "");
  // Route: /users
  if (pathname === "/users") {
    return handleCollection(req, res);
  }

  // Route: /users/:id
  const match = pathname.match(/^\/users\/([^/]+)$/);
  if (match) {
    return handleSingleUser(req, res, match[1]);
  }

  // Không khớp route nào
  sendJson(res, 404, { message: "Route not found" });
}

function handleCollection(req, res) {
  if (req.method === "GET") {
    return getUsers(req, res);
  }

  // Tao user do POST /auth/register dam nhiem, khong tao qua /users nua
  sendJson(res, 405, { message: "Method not allowed" });
}

function handleSingleUser(req, res, rawId) {
  const userId = parseUserId(rawId);

  if (userId === null) {
    return sendJson(res, 400, { message: "Invalid user ID" });
  }

  if (req.method === "GET") {
    return getUser(req, res, userId);
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    return updateUser(req, res, userId);
  }

  if (req.method === "DELETE") {
    return deleteUser(req, res, userId);
  }

  sendJson(res, 405, { message: "Method not allowed" });
}

function parseUserId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }
  return parseInt(value, 10);
}