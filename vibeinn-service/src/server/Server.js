import express from "express";
import cors from "cors";

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #accommRouter;
  #server;
  #reviewRouter;

  constructor(port, host, router, accommRouter, reviewRouter) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#router = router;
    this.#accommRouter = accommRouter;
    this.#reviewRouter = reviewRouter;
    /* this.#app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://vibeinnservice.onrender.com",
          "http://vibeinnservice.onrender.com",
        ],
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders:
          "Origin,X-Requested-With,Content-Type,Accept,Authorization, x-access-token",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    ); */
    this.#app.use(cors());
    this.#app.use(express.json());
  }

  getApp = () => {
    return this.#app;
  };

  start = () => {
    this.#app.use(this.#router.getRouteStartPoint(), this.#router.getRouter());
    this.#app.use(
      this.#accommRouter.getRouteStartPoint(),
      this.#accommRouter.getRouter()
    );
    this.#app.use(
      this.#reviewRouter.getRouteStartPoint(),
      this.#reviewRouter.getRouter()
    );
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server is listening on http://${this.#host}:${this.#port}`);
    });
  };

  close = () => {
    this.#server?.close();
  };
}
