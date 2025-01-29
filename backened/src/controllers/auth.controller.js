import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import User from "../models/user.modal.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if(!fullname||!email||!password){
      return res.status(400).json({message:"All field are required"});
    }
    console.log("Request body:", req.body);
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exist" });
    const salt = await bcrypt.genSalt(10);
    const hashespassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname,
      email,
      password: hashespassword,
    });

    if (newUser) {
      //genrate token
     generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
    
      });
    }
    else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signup",error.message);
    res.status(500).json({message:"internal Server Error"})
  }
};


export const login=async(req,res)=>{
    const{email,password}=req.body
    console.log("Request body:",req.body);
    try {
    const user=await User.findOne({email})
    console.log("user",user);
    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const ispass=await bcrypt.compare(password,user.password);
    if(!ispass){
        return res.status(400).json({message:"invalid credentials"});
    }
    generateToken(user._id,res);
    res.status(200).json({
        _id:user._id,
        fullname: user.fullname,
        email: user.email,
        profilepic: user.profilepic,
        
      });

    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"});
    } catch (error) {
        console.log("error in logout",error.message);
        res.status(500).json({message:"internal server error"});
    }
}

export const updateProfile=async(req,res)=>{
   try {
    const {profilepic}=req.body;
    const userId=req.user._id;
    
    if(!profilepic){
      return res.status(401).json({message:"profile pic is required"})

    }
    const uploadResponse= await cloudinary.uploader.upload(profilepic)
    const updateUser=await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})
    res.status(200).json(updateUser)
   } catch (error) {
     console.log("error in update profile ",error.message);
     res.status(401).json({message:"internal server error"});
   }
}

export const checkAuth=(req,res)=>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkauth controller",error.message);
    res.status(500).json({message:"internal server error"});
  }
}