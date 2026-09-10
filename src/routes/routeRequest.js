import { userRouter } from "./userRouter.js";
import { postRouter } from "./postRouter.js";
import { authRouter } from "./authRouter.js";
import { sendJson } from "../utils/response.js";

export function routeRequest(req, res) {
  if (req.url === "/users" || req.url.startsWith("/users/")) {
    return userRouter(req, res);
  }
  else if (req.url === "/posts" || req.url.startsWith("/posts/")) {
    return postRouter(req, res);
  }
  else if (req.url === "/auth" || req.url.startsWith("/auth/")) {
    return authRouter(req, res);
  }
  return sendJson(res, 404, {
    message: "Route not found",
  });

}