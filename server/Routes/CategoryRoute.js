const express = require("express");
const CategoryModel = require("../models/CategoryModel.js");
const UserModel = require("../models/UserModel.js");
const ProductModel = require("../models/ProductModel.js");
const router = express.Router();
const apiMiddleware = require("../middleware/apiMiddleware.js");
router.get("/getcategory/:UserId", apiMiddleware, async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const admin = await UserModel.findOne({ email: UserId });
    const adminId = admin.adminid;
    const getCategory = await CategoryModel.find({adminid:adminId});
    res.json(getCategory);
  } catch (error) {
    res.json(error);
  }
});

router.get("/getsubcategories/:id",apiMiddleware,async(req,res) => {
  try {
    const id = req.params.id;
    const getProduct = await ProductModel.findById({_id : id});
    const getCategory = getProduct.productCategory;
    const getSubCat = await CategoryModel.findOne({category: getCategory});
    res.json(getSubCat.subCategories);
  } catch (error){
    res.json(error);
  }
})

router.get("/getallsubcategories/:UserId", apiMiddleware, async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const admin = await UserModel.findOne({email: UserId});
    const adminId = admin.adminid;
    const categories = await CategoryModel.find({ adminid: adminId });
    const subcategoriesArray = await Promise.all(
      categories.map(async (category) => {
        return category.subCategories;
      })
    );
    const subCategories = subcategoriesArray.flat();

    res.json(subCategories);
  } catch (error) {
    res.json(error);
  }
});

router.get("/getspecificcategory/:subCat",apiMiddleware, async(req,res) => {
  try{
    const subCat = req.params.subCat;
    const getCat = await CategoryModel.findOne({
    subCategories: { $in: subCat },
    });
  const Cat = getCat.category;
  res.json(Cat);
  }catch(error){
    res.json(error);
  }
})

router.post("/addcategory/:UserId",apiMiddleware, async(req,res) => {
  try {
      const UserId = req.params.UserId;
      const {category,subCategory} = req.body;
      const admin = await UserModel.findOne({email: UserId});
      const adminId = admin.adminid;
      const newCategory = await CategoryModel.create({category,subCategories:subCategory,adminid:adminId});
      res.json(newCategory);
  }catch (error){
    res.json(error);
  }
})

router.get("/getallcategories/:UserId",apiMiddleware,async(req,res) => {
  try{
    const UserId = req.params.UserId;
    const admin = await UserModel.findOne({email: UserId});
    const adminId = admin.adminid;
    const allCategories = await CategoryModel.find({adminid: adminId});
    res.json(allCategories);
  }catch (error){
    console.log(error);
  }
})

router.delete("/deletecategory/:id",apiMiddleware,async(req,res) => {
  try{
    const id = req.params.id;
    const deletedCategory = await CategoryModel.findByIdAndDelete({_id: id});
    res.json(deletedCategory);
  }catch (error){
    res.json(error);
  }
})

router.get("/getcategorybyid/:catId",apiMiddleware, async(req,res) => {
  try{
    const catId = req.params.catId;
    const getCategoryById = await CategoryModel.findById({_id: catId});
    res.json(getCategoryById);
  }catch(error){
    res.json(error);
  }
})

router.put("/updatecategory/:catId",apiMiddleware, async (req,res) => {
  try {
    const catId = req.params.catId;
    const {updatedCategory, updatedSubCategory} = req.body;
    const newUpdatedCategory = await CategoryModel.findByIdAndUpdate({_id: catId},{category: updatedCategory, subCategories: updatedSubCategory});
    res.json(newUpdatedCategory);
  }catch (error) {
    console.log(error);
  }
})


module.exports = router;