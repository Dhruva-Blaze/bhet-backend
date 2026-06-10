import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  contact: string;
  message?: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CLOSED"],
      default: "NEW",
    },
  },
  { timestamps: true },
);

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
