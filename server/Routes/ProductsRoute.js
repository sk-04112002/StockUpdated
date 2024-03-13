// routes/upload.js
const express = require("express");
const ProductModel = require("../models/ProductModel.js");
const UserModel = require("../models/UserModel.js");
const router = express.Router();
const apiMiddleware = require("../middleware/apiMiddleware.js")

router.post("/:UserId",apiMiddleware, async (req, res) => {
  try {
    const UserId = req.params.UserId;
    const admin = await UserModel.findOne({email: UserId})  
    
    const {
      productImage,
      productBrand,
      productName,
      productCategory,
      productSubCategory,
      productQuantity,
      productMinQuantity,
      productMaxQuantity,
      productColour,
      productSize,
      productPrice,
      productDescription,
    } = req.body;
    console.log(productSubCategory);
    // Save the file details and product details to MongoDB
    
    if(productImage !== null || productBrand !== "" || productName !== "" || productQuantity !== "" || productMinQuantity !== "" || productMaxQuantity !== "" || productPrice !== "" || productDescription !== ""){
      const newProductModel = new ProductModel({
      productImage,
      productBrand,
      productName,
      productCategory,
      productSubCategory,
      productQuantity,
      productMinQuantity,
      productMaxQuantity,
      productColour,
      productSize,
      productPrice,
      productDescription,
      adminid: admin.adminid,
      updateStatus: false,
    });
    await newProductModel.save();
    res
      .status(201)
      .json(newProductModel);
  }
    }
     catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getproducts/:UserId",apiMiddleware, async (req,res) => {
  try {
      const UserId = req.params.UserId;
      const { sortBy } = req.query;
      let sortOptions = {};

      if (sortBy) {
        switch (sortBy) {
          case "name":
            sortOptions = { productName: 1 };
            break;
          case "price":
            sortOptions = { productPrice: 1 };
            break;
          case "category":
            sortOptions = { productCategory: 1 };
            break;
          case "brand":
            sortOptions = { productBrand: 1 };
            break;
          case "subcategory":
            sortOptions = { productSubCategory: 1 };
            break;
          default:
            sortOptions = {};
        }
      }
      const {productCategory, productSubCategory, productBrand, productColour, productSize} = req.query;


      const admin = await UserModel.findOne({email: UserId});
      const adminid = admin.adminid;
      let queryConditions;
      if(admin.role === "supervisor"){
         queryConditions = {
          adminid: adminid,
          productCategory: { $in: admin.userCategory },
          ...(productCategory && { productCategory }),
          ...(productSubCategory && { productSubCategory }),
          ...(productBrand && { productBrand }),
          ...(productColour && { productColour }),
          ...(productSize && { productSize }),
        };
      }else{
         queryConditions = {
          adminid: adminid,
          ...(productCategory && { productCategory }),
          ...(productSubCategory && { productSubCategory }),
          ...(productBrand && { productBrand }),
          ...(productColour && { productColour }),
          ...(productSize && { productSize }),
        };
      }
      

       const products = await ProductModel.find(queryConditions).sort(
         sortOptions
       );
       res.json(products);
     
  }catch (error){
      res.send(error)
  }

})

router.get("/getproductsinfo/:id",apiMiddleware, async (req,res) => {
  try {
    const id = req.params.id;
    const getProduct = await ProductModel.findById({_id: id})
    res.json(getProduct);
  }catch (error) {
    res.json(error)
  }
})

router.put("/updateproducts/:id",apiMiddleware, async (req,res) => {
  try {
    const id = req.params.id;
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      { _id: id },
      {
        productImage: req.body.productImage,
        productBrand: req.body.productBrand,
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productSubCategory: req.body.productSubCategory,
        productQuantity: req.body.productQuantity,
        productMinQuantity: req.body.productMinQuantity,
        productMaxQuantity: req.body.productMaxQuantity,
        productColour: req.body.productColour,
        productSize: req.body.productSize,
        productPrice: req.body.productPrice,
        productDescription: req.body.productDescription,
        updateStatus: true,
      }
    );
    res.json(updatedProduct);

  }catch (error) {
    res.json(error)
  }
})
router.delete("/deleteproduct/:id", apiMiddleware,async (req,res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await ProductModel.findByIdAndDelete({_id: id});
    res.json(deleteProduct);
  } catch (error){
    res.json(error);
  }
})



module.exports = router;
