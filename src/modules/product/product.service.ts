import { Product } from "./product.model";
import { ProductPricing } from "../pricing/pricing.model";
import { Category } from "../category/category.model";
import { ProductFilter } from "./product-filter.model";

export const createProductService = async (payload: any) => {
  const { categoryId, categoryIds = [], subCategoryIds = [], filterOptionIds = [], ...rest } = payload;

  const finalCategoryIds = categoryIds.length > 0 ? categoryIds : (categoryId ? [categoryId] : []);

  // Verify categories exist
  if (finalCategoryIds.length > 0) {
    const categoriesCount = await Category.countDocuments({
      _id: { $in: finalCategoryIds },
      isDeleted: false,
    });
    if (categoriesCount !== finalCategoryIds.length) {
      throw new Error("One or more categories not found");
    }
  }

  const product = await Product.create({ 
    categoryIds: finalCategoryIds, 
    subCategoryIds, 
    ...rest 
  });

  if (Array.isArray(filterOptionIds) && filterOptionIds.length > 0) {
    const mappings = filterOptionIds.map((filterOptionId: string) => ({
      productId: product._id,
      filterOptionId,
    }));

    await ProductFilter.insertMany(mappings);
  }

  return product;
};

export const getProductService = async (
  productId: string,
  role: string = "USER",
) => {
  const product = (await Product.findById(productId)
    .populate("categoryIds", "name slug parentCategoryId")
    .populate("subCategoryIds", "name slug parentCategoryId")
    .lean()) as any;
  if (!product) throw new Error("Product not found");

  product.categoryId = product.categoryIds?.[0] || null;
  product.defaultPrice = product.price;

  const rolePricing = await ProductPricing.findOne({ productId, role }).lean();
  if (rolePricing) {
    product.price = rolePricing.price;
  }

  return product;
};

export const getAdminProductService = async (productId: string) => {
  const product = await Product.findById(productId).lean();
  if (!product) throw new Error("Product not found");

  const [pricing, categories, subCategories, productFilters] = await Promise.all([
    ProductPricing.find({
      productId,
    }).lean(),

    Category.find({
      _id: { $in: product.categoryIds || [] },
      isDeleted: false,
    }).lean(),

    Category.find({
      _id: { $in: product.subCategoryIds || [] },
      isDeleted: false,
    }).lean(),

    ProductFilter.find({
      productId,
    }).lean(),
  ]);

  return {
    ...product,
    categoryId: product.categoryIds?.[0] || null, // For backward compatibility
    pricing,
    category: categories[0] || null, // For backward compatibility
    categories,
    subCategories,
    filterOptionIds: productFilters.map((item) =>
      item.filterOptionId.toString(),
    ),
  };
};

export const updateProductService = async (productId: string, payload: any) => {
  const { categoryId, categoryIds, subCategoryIds, filterOptionIds = [], ...rest } = payload;

  const finalCategoryIds = categoryIds && categoryIds.length > 0 ? categoryIds : (categoryId ? [categoryId] : undefined);

  if (finalCategoryIds) {
    // Verify categories exist
    const categoriesCount = await Category.countDocuments({
      _id: { $in: finalCategoryIds },
      isDeleted: false,
    });
    if (categoriesCount !== finalCategoryIds.length) {
      throw new Error("One or more categories not found");
    }
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      ...(finalCategoryIds && {
        categoryIds: finalCategoryIds,
      }),
      ...(subCategoryIds && {
        subCategoryIds,
      }),

      ...rest,
    },
    {
      new: true,
    },
  );

  if (!product) {
    throw new Error("Product not found");
  }

  // Remove old filter mappings
  await ProductFilter.deleteMany({
    productId,
  });

  // Create new filter mappings
  if (Array.isArray(filterOptionIds) && filterOptionIds.length > 0) {
    const mappings = filterOptionIds.map((filterOptionId: string) => ({
      productId,

      filterOptionId,
    }));

    await ProductFilter.insertMany(mappings);
  }

  return product;
};

export const listProductService = async (query: any, role: string = "USER") => {
  const {
    page = 1,
    limit = 10,
    search,
    minPrice,
    maxPrice,
    categoryId,
    categoryIds,
    filterOptionIds,
  } = query;

  const filter: any = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const idsToSearch = [];
  if (categoryIds) {
    idsToSearch.push(...categoryIds.split(",").filter(Boolean));
  } else if (categoryId) {
    idsToSearch.push(categoryId);
  }

  if (idsToSearch.length > 0) {
    // Find any subcategories for these categories
    const subCategories = await Category.find({ parentCategoryId: { $in: idsToSearch } }).lean();
    
    if (subCategories.length > 0) {
      const catIds = [
        ...idsToSearch,
        ...subCategories.map((c: any) => c._id.toString()),
      ];
      filter.$or = [
        { categoryIds: { $in: catIds } },
        { subCategoryIds: { $in: catIds } }
      ];
    } else {
      filter.$or = [
        { categoryIds: { $in: idsToSearch } },
        { subCategoryIds: { $in: idsToSearch } }
      ];
    }
  }

  if (filterOptionIds) {
    const ids = filterOptionIds.split(",").filter(Boolean);

    if (ids.length > 0) {
      const mappings = await ProductFilter.find({
        filterOptionId: { $in: ids },
      }).lean();

      const matchedProductIds = [
        ...new Set(mappings.map((m) => m.productId.toString())),
      ];

      filter._id = { $in: matchedProductIds };
    }
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate("categoryIds", "name slug parentCategoryId")
      .populate("subCategoryIds", "name slug parentCategoryId")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean(),

    Product.countDocuments(filter),
  ]);

  if (data.length > 0) {
    const productIds = data.map((p) => p._id);
    const pricings = await ProductPricing.find({
      productId: { $in: productIds },
      role,
    }).lean();

    const pricingMap = new Map();
    pricings.forEach((p) => pricingMap.set(p.productId.toString(), p.price));

    data.forEach((product: any) => {
      product.categoryId = product.categoryIds?.[0] || null;
      product.defaultPrice = product.price;
      if (pricingMap.has(product._id.toString())) {
        product.price = pricingMap.get(product._id.toString());
      }
    });
  }

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const listAdminProductService = async (query: any) => {
  const { page = 1, limit = 10, search, minPrice, maxPrice } = query;

  const filter: any = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
};

export const deleteProductService = async (productId: string) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  await ProductPricing.deleteMany({ productId });
  await ProductFilter.deleteMany({ productId });

  return true;
};
