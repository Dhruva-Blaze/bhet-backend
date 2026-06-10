export const formatFileUrls = (files: Express.Multer.File[]) => {
  return files.map((file, index) => ({
    // url: `/uploads/products/${file.filename}`,
    url: file.path,
    isPrimary: index === 0,
    public_id: file.filename,
  }));
};
