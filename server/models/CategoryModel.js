const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  category: String,
  subCategories: [String],
  adminid: String,
});

const CategoryModel = mongoose.model("CategorySchema", CategorySchema);
module.exports = CategoryModel;
