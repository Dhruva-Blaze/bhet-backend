import { Request, Response, NextFunction } from "express";
import {
  createProductService,
  updateProductService,
  listProductService,
  getProductService,
  getAdminProductService,
  listAdminProductService,
  deleteProductService,
} from "./product.service";
import { formatFileUrls } from "../../common/services/storage.service";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let images: { url: string; isPrimary: boolean; }[] = [];

    if (req.files && Array.isArray(req.files)) {
      images = formatFileUrls(req.files);
    }

    const payload = {
      ...req.body,
      price: Number(req.body.price),
      min_quantity: Number(req.body.min_quantity),
      images
    };

    if (req.body.filterOptionIds && typeof req.body.filterOptionIds === 'string') {
      try {
        payload.filterOptionIds = JSON.parse(req.body.filterOptionIds);
      } catch (e) {
        payload.filterOptionIds = req.body.filterOptionIds;
      }
    }

    if (req.body.categoryIds && typeof req.body.categoryIds === 'string') {
      try {
        payload.categoryIds = JSON.parse(req.body.categoryIds);
      } catch (e) {
        payload.categoryIds = req.body.categoryIds;
      }
    }

    if (req.body.subCategoryIds && typeof req.body.subCategoryIds === 'string') {
      try {
        payload.subCategoryIds = JSON.parse(req.body.subCategoryIds);
      } catch (e) {
        payload.subCategoryIds = req.body.subCategoryIds;
      }
    }

    if (req.body.primaryImageIndex !== undefined && payload.images) {
      const pIndex = Number(req.body.primaryImageIndex);
      payload.images = payload.images.map((img: any, idx: number) => ({
        ...img,
        isPrimary: idx === pIndex
      }));
    } else if (payload.images && payload.images.length > 0) {
      let primaryFound = false;
      payload.images = payload.images.map((img: any) => {
        if (img.isPrimary && !primaryFound) {
          primaryFound = true;
          return img;
        }
        return { ...img, isPrimary: false };
      });
      if (!primaryFound) payload.images[0].isPrimary = true;
    }

    const product = await createProductService(payload);

    res.status(201).json({
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request<{
    id: string;
  }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    let images: { url: string; isPrimary: boolean; }[] = [];
    
    // If new images are uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = formatFileUrls(req.files);
    }

    const payload = {
      ...req.body,
    };

    if (req.body.price) payload.price = Number(req.body.price);
    if (req.body.min_quantity) payload.min_quantity = Number(req.body.min_quantity);

    if (req.body.filterOptionIds && typeof req.body.filterOptionIds === 'string') {
      try {
        payload.filterOptionIds = JSON.parse(req.body.filterOptionIds);
      } catch (e) {
        payload.filterOptionIds = req.body.filterOptionIds;
      }
    }

    if (req.body.categoryIds && typeof req.body.categoryIds === 'string') {
      try {
        payload.categoryIds = JSON.parse(req.body.categoryIds);
      } catch (e) {
        payload.categoryIds = req.body.categoryIds;
      }
    }

    if (req.body.subCategoryIds && typeof req.body.subCategoryIds === 'string') {
      try {
        payload.subCategoryIds = JSON.parse(req.body.subCategoryIds);
      } catch (e) {
        payload.subCategoryIds = req.body.subCategoryIds;
      }
    }

    // Handle images: if we have existing images + new images
    // We expect existing images to be passed as a JSON string or array in req.body.existingImages
    if (req.body.existingImages) {
      const existing = typeof req.body.existingImages === 'string' 
        ? JSON.parse(req.body.existingImages) 
        : req.body.existingImages;
      payload.images = [...existing, ...images];
    } else if (images.length > 0) {
      // If only new images are provided and no existing images mentioned, 
      // we might want to append or replace. Let's assume append for now if not specified.
      // But typically, the frontend should send the full state.
      payload.images = images;
    }

    if (req.body.primaryImageIndex !== undefined && payload.images) {
      const pIndex = Number(req.body.primaryImageIndex);
      payload.images = payload.images.map((img: any, idx: number) => ({
        ...img,
        isPrimary: idx === pIndex
      }));
    } else if (payload.images && payload.images.length > 0) {
      let primaryFound = false;
      payload.images = payload.images.map((img: any) => {
        if (img.isPrimary && !primaryFound) {
          primaryFound = true;
          return img;
        }
        return { ...img, isPrimary: false };
      });
      if (!primaryFound) payload.images[0].isPrimary = true;
    }

    const product = await updateProductService(req.params.id, payload);

    res.json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = (req as any).user?.role || "USER";
    const product = await getProductService(req.params.id, role);

    res.json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = (req as any).user?.role || "USER";
    const result = await listProductService(req.query, role);

    res.json({
      message: "Products fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await getAdminProductService(req.params.id);

    res.json({
      message: "Admin product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await listAdminProductService(req.query);

    res.json({
      message: "Admin products fetched successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteProductService(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
