import bcrypt from "bcrypt";
import { UserRole } from "@/enums/user.enum";
import { UserDocument } from "@/interfaces/user.interface";
import { Schema, model } from "mongoose";

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: Object.values(UserRole), default: UserRole.USER },
    password: { type: String, required: true },
    phoneNumber: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(8));
  }

  next();
});

const UserModel = model("User", userSchema);
export default UserModel;
