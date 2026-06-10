import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentCategoryId?: mongoose.Types.ObjectId | null;
  isActive?: boolean;
  isDeleted: boolean;
  bannerImage?: {
    url: string;
    public_id: string;
  };
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    bannerImage: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true },
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
