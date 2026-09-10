import { sendJson } from "../utils/response.js";
import { register, login } from "../controllers/authController.js";

export async function authRouter(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "");

  if (pathname === "/auth/register") {
    if (req.method === "POST") {
      return register(req, res);
    }
    return sendJson(res, 405, { message: "Method Not Allowed" });
  }
  if (pathname === "/auth/login") {
    if (req.method === "POST") {
      return login(req, res);
    }
    return sendJson(res, 405, { message: "Method Not Allowed" });
  }
  return sendJson(res, 404, { message: "Route not found" });
}
