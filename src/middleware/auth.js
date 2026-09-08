import { sendJson } from "../utils/response.js";

export function auth(req, res, next) {
  const authorization = req.headers.authorization;

  if (authorization !== "Bearer valid-token") {
    sendJson(res, 401, {
      message: "Unauthorized",
    });
    return;
  }

  return next();
}