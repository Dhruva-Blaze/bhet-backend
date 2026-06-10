import slugify from "slugify";

import { FilterOption } from "./filter-option.model";

export const createFilterOptionService = async (body: any) => {
  return await FilterOption.create({
    ...body,

    value: slugify(body.label, {
      lower: true,
      strict: true,
    }),
  });
};

export const updateFilterOptionService = async (id: string, body: any) => {
  const updateData: any = {
    ...body,
  };

  if (body.label) {
    updateData.value = slugify(body.label, {
      lower: true,
      strict: true,
    });
  }

  return await FilterOption.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    updateData,
    {
      new: true,
    },
  );
};

export const listFilterOptionService = async (filterGroupId: string) => {
  return await FilterOption.find({
    filterGroupId,
    isDeleted: false,
  })
    .sort({ label: 1 })
    .lean();
};
