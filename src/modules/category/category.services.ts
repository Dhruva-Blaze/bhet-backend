import { Category } from "./category.model";

export const createCategoryService = async (payload: any) => {
  const exists = await Category.findOne({
    slug: payload.slug,
    isDeleted: false,
  });

  if (exists) {
    throw new Error("Category already exists");
  }

  const category = await Category.create(payload);

  return category;
};

export const updateCategoryService = async (
  categoryId: string,
  payload: any,
) => {
  const exists = await Category.findOne({ _id: categoryId, isDeleted: false });

  if (!exists) {
    throw new Error("Category not found");
  }

  const category = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true,
  });

  return category;
};

export const listCategoryService = async (query: any) => {
  const { page = 1, limit = 10, search, parentCategoryId } = query;

  const filter: any = {
    isDeleted: false,
  };

  // if(search) {
  //     filter.$text = { $search: search }
  // }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (parentCategoryId) {
    filter.parentCategoryId = parentCategoryId;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Category.find(filter)
      .populate("parentCategoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Category.countDocuments(filter),
  ]);

  return {
    data,
    meta: { total, page, limit },
  };
};



export const deleteCategoryService = async (categoryId: string) => {
  const exists = await Category.findOne({ _id: categoryId, isDeleted: false });

  if (!exists) {
    throw new Error("Category not found");
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { isDeleted: true },
    { new: true },
  );

  return category;
};
