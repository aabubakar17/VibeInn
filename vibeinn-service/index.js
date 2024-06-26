import Config from "./src/config/Config.js";
import Database from "./src/db/db.js";
import Server from "./src/server/Server.js";
import AuthRoutes from "./src/routes/authRoutes.js";
import AccommodationRoutes from "./src/routes/accomRoutes.js";

Config.load();
const { PORT, HOST, DB_URI, JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

const authRoutes = new AuthRoutes();
const accomRoutes = new AccommodationRoutes();

const server = new Server(PORT, HOST, authRoutes, accomRoutes);
const database = new Database(DB_URI);

database.connect().then(() => {
  server.start();
});
