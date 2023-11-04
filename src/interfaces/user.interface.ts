import { UserRole } from "@/enums/user.enum";
import { Document } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface UserDocument extends Document, User {}
