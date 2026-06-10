import { Contact } from "./contact.model";
import { sendContactEmail } from "../../common/services/email.service";

export const createContactService = async (payload: any) => {
  // 1. Save in DB
  const contact = await Contact.create(payload);

  // 2. Send email (async)
  await sendContactEmail(payload);

  return contact;
};

export const listAdminContactService = async (query: any) => {
  const { page = 1, limit = 10, search, status } = query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { contact: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    Contact.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }).lean(),
    Contact.countDocuments(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  };
};

export const getAdminContactService = async (id: string) => {
  const contact = await Contact.findById(id).lean();
  if (!contact) throw new Error("Contact inquiry not found");
  return contact;
};

export const updateAdminContactStatusService = async (id: string, status: string) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();
  if (!contact) throw new Error("Contact inquiry not found");
  return contact;
};

export const deleteAdminContactService = async (id: string) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new Error("Contact inquiry not found");
  return contact;
};
