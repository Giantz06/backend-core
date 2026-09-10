import { sendJson } from "../utils/response.js";
import { parseBody } from "../utils/body.js";
import {
  getAllUsers,
  getUserById,
  updateUser as updateUserInService,
  deleteUser as deleteUserInService,
} from "../service/userService.js";

export async function getUsers(req, res) {
  const users = await getAllUsers();
  sendJson(res, 200, users);
}

export async function getUser(req, res, userId) {
  const user = await getUserById(userId);
  sendJson(res, 200, user);
}

export async function updateUser(req, res, userId) {
  const body = await parseBody(req);
  const data = parseJsonBody(body);

  const user = await updateUserInService(userId, data);
  sendJson(res, 200, user);
}

export async function deleteUser(req, res, userId) {
  const result = await deleteUserInService(userId);
  sendJson(res, 200, result);
}

function parseJsonBody(body) {
  try {
    return JSON.parse(body);
  } catch {
    const err = new Error("Invalid Json");
    err.statusCode = 400;
    throw err;
  }
}
