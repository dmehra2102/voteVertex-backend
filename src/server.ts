import App from "./app";
import AuthRoute from "./routes/auth.routes";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new AuthRoute()]);

app.listen();
