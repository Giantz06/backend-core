import { sendJson } from "../utils/response.js";
import { parseBody } from "../utils/body.js";
import { registerUser, loginUser } from "../service/authService.js";


export async function register(req, res) {
  const body = await parseBody(req);
  const data = parseJsonBody(body);
  const user = await registerUser(data);
  sendJson(res, 201, user);
}

export async function login(req, res) {
  const body = await parseBody(req);
  const data = parseJsonBody(body);
  const { token, user } = await loginUser(data);
  sendJson(res, 200, { token, user });
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
