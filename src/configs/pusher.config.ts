import Pusher from "pusher";
import { PUSHER_APP_ID, PUSHER_CLUSTER, PUSHER_KEY, PUSHER_SECRET } from "./env.config";

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  cluster: PUSHER_CLUSTER,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  useTLS: true,
});

export default pusher;