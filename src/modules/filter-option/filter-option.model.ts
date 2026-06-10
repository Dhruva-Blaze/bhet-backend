import mongoose, { Schema, Document } from "mongoose";

export interface IFilterOption extends Document {
  filterGroupId: mongoose.Types.ObjectId;
  label: string;
  value: string;
  isActive: boolean;
  isDeleted: boolean;
}

const filterOptionSchema = new Schema<IFilterOption>(
  {
    filterGroupId: {
      type: Schema.Types.ObjectId,
      ref: "FilterGroup",
      required: true,
      index: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
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

export const FilterOption = mongoose.model<IFilterOption>(
  "FilterOption",
  filterOptionSchema,
);
