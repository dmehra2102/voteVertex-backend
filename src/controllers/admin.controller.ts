import { UserRequest } from "@/interfaces/userRequest.interface";
import UserModel from "@/models/user.model";
import { logger } from "@/utils/logger";
import { NextFunction, Response } from "express";

class AdminController {
  public getAllUsers = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find();
      logger.info("Success in adminController.getAllUsers");
      return res.status(200).send({ error: false, data: users });
    } catch (error: any) {
      logger.error(`Error in adminController.getAllUsers: ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };
}

export default AdminController;
