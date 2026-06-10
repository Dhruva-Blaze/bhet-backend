import mongoose, { Document, model, Schema } from "mongoose";

export interface ProductPricing extends Document {
  productId: mongoose.Types.ObjectId;
  role: "CLIENT" | "VENDOR" | "USER";
  price: number;
}

const productPricingSchema = new Schema<ProductPricing>({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ["CLIENT", "VENDOR", "USER"],
    required: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

productPricingSchema.index({ productId: 1, role: 1 }, { unique: true });

export const ProductPricing = model<ProductPricing>(
  "ProductPricing",
  productPricingSchema,
);
