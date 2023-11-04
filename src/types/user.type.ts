import { UserRole } from "@/enums/user.enum";
import { UserDocument } from "@/interfaces/user.interface";
import { Model } from "mongoose";

export type UserModelInterface = Model<UserDocument>;

export type RegisterUserInput = {
  name: string;
  password: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
};
