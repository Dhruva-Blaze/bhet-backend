import mongoose, { Schema, Document } from "mongoose";

export interface IProductFilter extends Document {
  productId: mongoose.Types.ObjectId;

  filterOptionId: mongoose.Types.ObjectId;
}

const productFilterSchema = new Schema<IProductFilter>(
  {
    productId: {
      type: Schema.Types.ObjectId,

      ref: "Product",

      required: true,

      index: true,
    },

    filterOptionId: {
      type: Schema.Types.ObjectId,

      ref: "FilterOption",

      required: true,

      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Fast filtering
productFilterSchema.index({
  filterOptionId: 1,
  productId: 1,
});

// Prevent duplicate mappings
productFilterSchema.index(
  {
    productId: 1,
    filterOptionId: 1,
  },
  {
    unique: true,
  },
);

export const ProductFilter = mongoose.model<IProductFilter>(
  "ProductFilter",
  productFilterSchema,
);
