import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    branch: { type: String, required: true, trim: true },

    idCardUrl: { type: String },          // e.g. /uploads/idcards/123-file.jpg
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
