const mongoose = require('mongoose');
async function run() {
  await mongoose.connect('mongodb://localhost:27017/customize_gifts');
  const db = mongoose.connection.db;
  const filters = await db.collection('filtergroups').find({ scope: "CATEGORY", isDeleted: false }).toArray();
  console.log("Category filters:");
  for (const f of filters) {
    const cat = await db.collection('categories').findOne({ _id: f.categoryId });
    console.log(`- Filter: ${f.name}, Category: ${cat ? cat.name : "UNKNOWN"} (${f.categoryId}), Parent: ${cat && cat.parentCategoryId ? cat.parentCategoryId : "NONE"}`);
  }
  process.exit(0);
}
run().catch(console.error);
