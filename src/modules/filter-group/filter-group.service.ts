import { FilterGroup } from "./filter-group.model";
import { FilterOption } from "../filter-option/filter-option.model";
import slugify from "slugify";
import mongoose from "mongoose";

export const createFilterGroupService = async (payload: any) => {
  const filterGroup = await FilterGroup.create({
    ...payload,
    categoryId: payload.scope === "GLOBAL" ? null : payload.categoryId,
    slug: slugify(payload.name, { lower: true, strict: true }),
  });

  if (payload.options && payload.options.length > 0) {
    const optionsData = payload.options.map((opt: string) => ({
      filterGroupId: filterGroup._id,
      label: opt,
      value: slugify(opt, { lower: true, strict: true }),
    }));
    await FilterOption.insertMany(optionsData);
  }

  return filterGroup;
};

export const listFilterGroupService = async (query: any) => {
  const filter: any = {
    isDeleted: false,
  }

  if (query.scope) {
    filter.scope = query.scope;
  }

  if (query.categoryId) {
    const ids = query.categoryId.split(",").filter(Boolean);
    if (ids.length > 1) {
      filter.categoryId = { $in: ids };
    } else {
      filter.categoryId = query.categoryId;
    }
  }
  const groups = await FilterGroup.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  const groupIds = groups.map((g) => g._id);
  const options = await FilterOption.find({ filterGroupId: { $in: groupIds }, isDeleted: false }).lean();

  return groups.map((group) => ({
    ...group,
    options: options.filter((opt) => opt.filterGroupId.toString() === group._id.toString()),
  }));
};

export const updateFilterGroupService = async (id: string, payload: any) => {
  const updateData: any = { ...payload };
  if (payload.name) {
    updateData.slug = slugify(payload.name, { lower: true, strict: true });
  }
  if (payload.scope === "GLOBAL") {
    updateData.categoryId = null;
  }

  const filterGroup = await FilterGroup.findByIdAndUpdate(id, updateData, { new: true });

  if (payload.options) {
    await FilterOption.deleteMany({ filterGroupId: id });
    if (payload.options.length > 0) {
      const optionsData = payload.options.map((opt: string) => ({
        filterGroupId: id,
        label: opt,
        value: slugify(opt, { lower: true, strict: true }),
      }));
      await FilterOption.insertMany(optionsData);
    }
  }
  return filterGroup;
};

export const deleteFilterGroupService = async (id: string) => {
  await FilterGroup.findByIdAndUpdate(id, { isDeleted: true });
  await FilterOption.updateMany({ filterGroupId: id }, { isDeleted: true });
  return true;
};

export const getFiltersBySubcategoriesService = async (subCategoryIds: string[]) => {
  const categoryObjectIds = subCategoryIds.map((id) => new mongoose.Types.ObjectId(id));

  return await FilterGroup.aggregate([
    {
      $match: {
        isDeleted: false,
        isActive: true,
        $or: [
          { scope: "GLOBAL" },
          { scope: "CATEGORY", categoryId: { $in: categoryObjectIds } },
        ],
      },
    },
    {
      $lookup: {
        from: "filteroptions",
        localField: "_id",
        foreignField: "filterGroupId",
        as: "options",
        pipeline: [
          {
            $match: {
              isDeleted: false,
              isActive: true,
            },
          },
          {
            $project: {
              _id: 1,
              label: 1,
              value: 1,
            },
          },
          {
            $sort: {
              label: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        scope: 1,
        options: 1,
      },
    },
    {
      $sort: {
        scope: 1,
        createdAt: 1,
      },
    },
  ]);
};
