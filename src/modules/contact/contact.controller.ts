import { Request, Response, NextFunction } from "express";
import {
  createContactService,
  listAdminContactService,
  getAdminContactService,
  updateAdminContactStatusService,
  deleteAdminContactService,
} from "./contact.service";

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contact = await createContactService(req.body);

    res.status(201).json({
      message: "Inquiry submitted successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await listAdminContactService(req.query);

    res.status(200).json({
      message: "Contacts retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contact = await getAdminContactService(req.params.id as string);

    res.status(200).json({
      message: "Contact retrieved successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminContactStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body;
    const contact = await updateAdminContactStatusService(
      req.params.id as string,
      status,
    );

    res.status(200).json({
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteAdminContactService(req.params.id as string);

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
