import express from "express";
import cors from "cors";

export default class Server {
  #app;
  #host;
  #port;
  #router;

  #server;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#router = router;
    this.#initialiseMiddlewares(); // Initialize middlewares in the constructor
  }

  #initialiseMiddlewares = () => {
    this.#app.use(cors()); // Apply CORS middleware
    this.#app.use(express.json()); // Parse incoming JSON requests
  };

  getApp = () => {
    return this.#app;
  };

  start = () => {
    this.#app.use(this.#router.getRouteStartPoint(), this.#router.getRouter()); // Use router after initializing middlewares
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  };

  close = () => {
    this.#server?.close();
  };
}
