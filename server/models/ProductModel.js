const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  productImage: String,
  productBrand: String,
  productName: String,
  productCategory: String,
  productSubCategory: String,
  productQuantity: Number,
  productMinQuantity: Number,
  productMaxQuantity: Number,
  productColour: String,
  productSize: String,
  productPrice: Number,
  productDescription: String,
  adminid: String,
  updateStatus: Boolean,
});

const ProductModel = mongoose.model("ProductSchema", ProductSchema);
module.exports = ProductModel
