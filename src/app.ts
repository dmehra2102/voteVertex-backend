import express, { Application } from "express";
import { Routes } from "./interfaces/routes.interface";
import { COOKIE_DOMAIN, MONGODB_URI, NODE_ENV, PORT, SESSION_SECRET, LOG_FORMAT } from "./configs/env.config";
import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import passportConfig from "./configs/passport.config";
import passport from "passport";
import { logger, stream } from "./utils/logger";
import { connect } from "mongoose";
import { dbConnection } from "./database";
import { set } from "mongoose";
import morgan from "morgan";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const MongoDBSession = ConnectMongoDBSession(session);
passportConfig(passport);

class App {
  public app: Application;
  public port: string | number;
  public env: string;
  public store: any;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;
    this.store = new MongoDBSession({ uri: MONGODB_URI, collection: "voteVertexSession" });
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    const origins: boolean | string | RegExp | (boolean | string | RegExp)[] = [];

    if (["development", "test"].includes(NODE_ENV)) {
      origins.push(/localhost:/);
    }
    this.app.use(
      cors({
        origin: origins,
        credentials: true,
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(
      session({
        name: "voteVertex-session",
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: this.store,
        cookie: {
          domain: COOKIE_DOMAIN,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: false,
          secure: false,
        },
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", false);
    }

    connect(dbConnection.uri, dbConnection.options)
      .then(() => {
        console.log("Successfully connected to DB");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
