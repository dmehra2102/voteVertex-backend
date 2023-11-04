import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGODB_URI: str(),
    SESSION_SECRET: str(),
    PUSHER_APP_ID: str(),
    PUSHER_KEY: str(),
    PUSHER_SECRET: str(),
    PUSHER_CLUSTER: str(),
  });
};

export default validateEnv;
