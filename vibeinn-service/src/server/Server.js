import express from "express";
import cors from "cors";

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #accommRouter;
  #server;

  constructor(port, host, router, accommRouter) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#router = router;
    this.#accommRouter = accommRouter;
    this.#initialiseMiddlewares();
  }

  #initialiseMiddlewares = () => {
    this.#app.use(cors());
    this.#app.use(express.json());
  };

  getApp = () => {
    return this.#app;
  };

  start = () => {
    this.#app.use(this.#router.getRouteStartPoint(), this.#router.getRouter());
    this.#app.use(
      this.#accommRouter.getRouteStartPoint(),
      this.#accommRouter.getRouter()
    );
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  };

  close = () => {
    this.#server?.close();
  };
}
