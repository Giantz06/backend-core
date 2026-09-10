import { sendJson } from "../utils/response.js";

const PUBLIC_ROUTES = [
  "/auth/register",
  "/auth/login"
];

export function auth(req, res, next) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "");
  if (PUBLIC_ROUTES.includes(pathname)) {
    return next();
  }
  const authorization = req.headers.authorization;

  if (authorization !== "Bearer valid-token") {
    sendJson(res, 401, { message: "Unauthorized" });
    return;
  }

  return next();
}
