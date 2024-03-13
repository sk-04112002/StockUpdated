const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel.js");
const CategoryModel = require("../models/CategoryModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("shortid");
const nodemailer = require("nodemailer");
const apiMiddleware = require('../middleware/apiMiddleware.js')

const generateToken = (id) => {
  return jwt.sign({id}, "SaravanaKumarS", {expiresIn:"1hr"})
}

router.post("/login",apiMiddleware, (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    res.json("Please fill all required fields")
  }
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = generateToken({email: user.email});
            res.cookie("token",token);
            res.json("Login Successfull !");
          } else {
            res.json("Incorrect Password");
          }
        });
      } else {
        res.json("User Not Found");
      }
    })
    .catch((err) => res.json(err));
});


router.post("/register",apiMiddleware, async (req, res) => {
  const { name, email, password, role } = req.body;
  if(!name || !email || !password){
    res.json("Please fill all required fields")
  }
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  const adminId = uuid.generate();
  const categories = [
    {
      category: "Electronics",
      subCategories: ["Laptop", "Mobile Phone", "Tablet", "Speaker"],
      adminid: adminId,
    },
    {
      category: "Fashion",
      subCategories: [
        "Shirt",
        "Slippers",
        "T-Shirt",
        "Shoe",
        "Pant",
        "Trouser",
        "Hat",
      ],
      adminid: adminId,
    },
    {
      category: "Accessories",
      subCategories: ["Chain", "Watch", "Bracelet", "Ring"],
      adminid: adminId,
    },
    {
      category: "Furniture",
      subCategories: ["Sofa", "Chair", "Bed", "Table"],
      adminid: adminId,
    },
    {
      category: "Dairy Products",
      subCategories: ["Milk", "Butter", "Ghee", "Cheese"],
      adminid: adminId,
    },
    {
      category: "Agro Products",
      subCategories: ["Fruits", "Vegetables", "Food"],
      adminid: adminId,
    },
  ];

  for (const category of categories) {
    await CategoryModel.create(category);
  }

  UserModel.create({ name, email, password: hash, role, adminid: adminId })
    .then((user) => {
     

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "coolstevensaravana10@gmail.com",
          pass: "wkbp segw mwkc znzo",
        },
      });

      var mailOptions = {
        from: "coolstevensaravana10@gmail.com",
        to: user.email,
        subject: "Account Creation Successfully",
        text: `Hello ${user.name} your account created successfully here is your admin id : ${user.adminid}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json(user)
    })
    .catch((err) => res.json(err));
});

router.get("/getuser/:UserId",apiMiddleware, async (req,res) => {
  const UserId = req.params.UserId;
  const user = await UserModel.findOne({email: UserId});
  const name = user.name;
  res.json({name: name});
})
router.post("/logout", async (req,res) => {
  res.cookie("token", "");
  res.json("Logout Successfull")
})

router.post("/createuser/:UserId",apiMiddleware, async (req,res) => {
  const { name, email, password, role, userCategory } = req.body;
  const UserId = req.params.UserId;
  const admin = await UserModel.findOne({email: UserId});
  if (!name || !email || !password) {
    res.json("Please fill all required fields");
  }
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  const adminId = admin.adminid;
  UserModel.create({ name, email, password: hash, role, adminid: adminId, userCategory: userCategory })
    .then((user) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "coolstevensaravana10@gmail.com",
          pass: "wkbp segw mwkc znzo",
        },
      });

      var mailOptions = {
        from: "coolstevensaravana10@gmail.com",
        to: user.email,
        subject: "Account Created Successfully",
        text: `Hello ${user.name} your account created successfully here is your id : ${user.adminid}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json(user);
    })
    .catch((err) => res.json(err));

})
router.get("/findrole/:UserId", apiMiddleware, async (req,res) => {
    const UserId = req.params.UserId;
    const User = await UserModel.findOne({email: UserId});
    const role = User.role
    res.json({role: role});
  
  
})

router.get("/getuserdetails/:UserId",apiMiddleware, async(req,res) => {
  const UserId = req.params.UserId;
  const {userCategory} = req.query;
  const User = await UserModel.findOne({email: UserId});
  const adminid = User.adminid;
   queryConditions = {
     adminid: adminid,
     ...(userCategory && { userCategory }),
   };
  const UserData = await UserModel.find(queryConditions);
  res.json(UserData);
})
router.delete("/deleteuser/:id",apiMiddleware, async(req,res) => {
  const id = req.params.id;
  const deleteUser = await UserModel.findByIdAndDelete({_id: id});
  res.json(deleteUser);
})
router.put("/forgotpassword",apiMiddleware ,async (req,res) => {
  try{
    const {email, password} = req.body;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const User = await UserModel.findOneAndUpdate({email},{password: hash});
    res.json("Password Changed Successfully!");
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "coolstevensaravana10@gmail.com",
          pass: "wkbp segw mwkc znzo",
        },
      });

      var mailOptions = {
        from: "coolstevensaravana10@gmail.com",
        to: email,
        subject: "Password Changed Successfully",
        text: `Password Changed Successfully`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      })

  }catch (error){
    console.log(error);
  }
})
router.get("/getuserinfo/:id",apiMiddleware, async(req,res) => {
  try {
    const UserId = req.params.id;
    const User = await UserModel.findOne({_id: UserId});
    res.json(User);
  } catch(error){
    res.json(error);
  }
});
router.put("/updateuserinfo/:id",apiMiddleware, async(req,res) => {
  try{
    const UserId = req.params.id;
    const {password} = req.body;
    const findPassword = await UserModel.findOne({_id: UserId});
    if(password !== findPassword.password){
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const updatedUser = await UserModel.findByIdAndUpdate({_id:UserId}, {name: req.body.name, email: req.body.email, password: hash, role: req.body.role, userCategory: req.body.userCategory})
      res.json(updatedUser);
    }else{
      const User = await UserModel.findByIdAndUpdate(
        { _id: UserId },
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          userCategory: req.body.userCategory,
        }
      );
      res.json(User);
    }

  }catch(error){
    res.json(error);
  }
})
module.exports = router;
