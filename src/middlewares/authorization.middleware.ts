import { UserRole } from "@/enums/user.enum";
import { UserRequest } from "@/interfaces/userRequest.interface";
import { NextFunction, Response } from "express";

export function createIsAuthorized() {
  return async function isAuthorized(req: UserRequest, res: Response, next: NextFunction) {
    if ([UserRole.ADMIN].includes(req.user?.role)) {
      return next();
    }
    return res.status(401).send({ message: "User not authorized", error: true });
  };
}

export const ensureAdminAuthorised = createIsAuthorized();
