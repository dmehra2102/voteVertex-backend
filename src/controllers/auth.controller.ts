import { COOKIE_DOMAIN } from "@/configs/env.config";
import { UserRequest } from "@/interfaces/userRequest.interface";
import UserModel from "@/models/user.model";
import { RegisterUserInput } from "@/types/user.type";
import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role, phoneNumber }: RegisterUserInput = req.body;
      if (!email || !name || !password) {
        return res.status(400).send({ error: true, message: "Name, email and password are required" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ error: true, message: "User already exists with the same email." });
      }

      const newUser = new UserModel({ name, email, password, role });

      if (phoneNumber) {
        newUser.phoneNumber = phoneNumber;
      }
      await newUser.save();
      logger.info(`Success in authController.register. New User with email : ${email} has been registered successfully.`);
      return res.status(201).send({
        error: false,
        message: "User registered successfully.",
        data: { _id: newUser._id, name, email, role, phoneNumber },
      });
    } catch (error: any) {
      logger.error(`Error in authController.register : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate("local", function (err: any, user: Express.User) {
        if (err || !user) {
          logger.error(`login execution failed with error: ${err.message}`);
          return res.status(401).json({
            err: err,
          });
        }
        req.logIn(user, function (err) {
          if (err) {
            logger.error(`login execution failed with error: ${err.message}`);
            return next(err);
          }
          logger.info("login execution completed");
          return res.status(200).json({
            status: "Sign up successful!",
          });
        });
      })(req, res, next);
    } catch (error: any) {
      logger.error(`Error in authController.login while trying to login a user. Error : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public getUserDetail = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const loggedInUser = await UserModel.findById(user._id).select("-password");
      if (!loggedInUser) {
        logger.error(`getUserDetail execution failed with error: User not found with userId: ${user?._id}`);
        return res.status(404).send({ error: true, message: "User not found" });
      }

      logger.info("getUserDetail execution completed");
      return res.status(200).send({ error: false, data: loggedInUser });
    } catch (error: any) {
      logger.error(`Error in authController.getUserDetail : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };

  public signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("signout execution started");
      req.logout(function (err) {
        if (err) {
          logger.error(`signout execution failed with error: ${err.message}`);
          return next(err);
        }
        logger.info("signout execution completed");
        res.status(200).clearCookie("voteVertex-session", {
          domain: COOKIE_DOMAIN,
        });
        req.session.destroy(function (err) {
          if (err) {
            logger.error(`signout execution failed with error: ${err.message}`);
            return next(err);
          }
          logger.info("signout execution completed");
          return res.status(200).send({ message: "Logged out successfully", error: false });
        });
      });
    } catch (error: any) {
      logger.error(`Error in authController.signout : ${error.message}`);
      return res.status(400).send({ error: true, message: error.message });
    }
  };
}

export default AuthController;
