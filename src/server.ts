import App from "./app";
import AdminRoute from "./routes/admin.routes";
import AuthRoute from "./routes/auth.routes";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new AuthRoute(), new AdminRoute()]);

app.listen();
