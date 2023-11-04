import { UserRequest } from "@/interfaces/userRequest.interface";
import { NextFunction, Response } from "express";

export default function ensureAuthenticated(req: UserRequest, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send({ message: "User not authenticated", error: true });
}
