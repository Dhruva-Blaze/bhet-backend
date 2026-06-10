import { ProductPricing } from "./pricing.model";

export const upsertPricingService = async (  productId: string,
  pricing: { role: string; price: number }[],
) => {
    const operations = pricing.map((p) => ({
          updateOne: {
      filter: {
        productId,
        role: p.role
      },
      update: {
        $set: {
          price: p.price
        }
      },
      upsert: true
    }
    }))

    await ProductPricing.bulkWrite(operations);
    return true;
}