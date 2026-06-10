import mongoose, { Schema, Document } from "mongoose";

export interface IFilterGroup extends Document {
  categoryId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  scope: "GLOBAL" | "CATEGORY";
  isActive: boolean;
  isDeleted: boolean;
}

const filterGroupSchema = new Schema<IFilterGroup>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    scope: {
      type: String,
      enum: ["GLOBAL", "CATEGORY"],
      required: true,
      default: "CATEGORY",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const FilterGroup = mongoose.model<IFilterGroup>(
  "FilterGroup",
  filterGroupSchema,
);
