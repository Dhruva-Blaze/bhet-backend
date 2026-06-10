import mongoose, { Schema, Document, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  content: string;
  price: number;
  min_quantity: number;
  product_status?: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  images: {
    url: string;
    alt?: string;
    isPrimary?: boolean;
    public_id: string;
  }[];
  categoryIds: string[];
  subCategoryIds: string[]
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String, // HTML / rich text
      required: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    min_quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    product_status: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"],
      default: "IN_STOCK",
    },

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
        public_id: { type: String },
      },
    ],
    categoryIds: [
      {
      type: Schema.Types.ObjectId,
      ref: "Category",
      }
    ],
    subCategoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      }
    ]
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>("Product", productSchema);
