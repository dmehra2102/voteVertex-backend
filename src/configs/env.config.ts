import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { NODE_ENV, LOG_FORMAT,PORT, MONGODB_URI, SESSION_SECRET, COOKIE_DOMAIN, PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } =
  process.env;
