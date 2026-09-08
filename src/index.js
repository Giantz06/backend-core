import "dotenv/config";
import { startServer } from "./server.js";

startServer(Number(process.env.PORT) || 3000);
