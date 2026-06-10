import mongoose from "mongoose";
import { Category } from "./category.model";
import { FilterGroup } from "../filter-group/filter-group.model";

export const getWebsiteCategoriesService = async () => {
  const categories = await Category.aggregate([
    {
      $match: {
        parentCategoryId: null,
        isActive: true,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "parentCategoryId",
        as: "subCategories",
        pipeline: [
          {
            $match: {
              isActive: true,
              isDeleted: false,
            },
          },
          {
            $project: {
              name: 1,
              slug: 1,
            },
          },

          {
            $sort: { name: 1 },
          },
        ],
      },
    },

    {
      $project: {
        name: 1,
        slug: 1,
        subCategories: 1,
        bannerImage: 1,
      },
    },

    {
      $sort: { name: 1 },
    },
  ]);

  return categories;
};

export const getWebsiteSubcategoriesService = async (parentIds: string[]) => {
  const objectIds = parentIds.map((id) => new mongoose.Types.ObjectId(id));
  return await Category.find({
    parentCategoryId: { $in: objectIds },
    isActive: true,
    isDeleted: false,
  })
    .select("name slug")
    .sort({ name: 1 })
    .lean();
};

export const getWebsiteFiltersService = async (categoryIds: string[]) => {
  const objectIds = categoryIds.map((id) => new mongoose.Types.ObjectId(id));
  return await FilterGroup.aggregate([
    {
      $match: {
        isDeleted: false,
        isActive: true,

        $or: [
          {
            scope: "GLOBAL"
          },
          {
            scope: "CATEGORY",
            categoryId: { $in: objectIds }
          }
        ]
      }
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
              isActive: true
            }
            
          },

          {
            $project: {
              label: 1,
              value: 1
            }
          },

          {
            $sort: { label: 1 }
          }
        ]
      }
    },

    {
      $project: {
        name: 1,
        slug: 1,
        scope: 1,
        options: 1
      }
    },

    {
      $sort: { createdAt: 1 }
    }
  ])
}
