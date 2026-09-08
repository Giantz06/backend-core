import http from "node:http";
import { routeRequest } from "./routes/routeRequest.js";
import { logger } from "./middleware/logger.js";
import { auth } from "./middleware/auth.js";
import { runMiddleware } from "./middleware/middlewareRunner.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const server = http.createServer((req, res) => {
  runMiddleware(
    req,
    res,
    [logger, auth],
    async () => routeRequest(req, res),
    errorHandler
  );
});

export function startServer(port = 3000) {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}