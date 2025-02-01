import {asyncHandler} from '../utils/asynchandler.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
// import { Liked } from '../models/Liked.model.js';
import jwt from "jsonwebtoken"
// import { Review } from '../models/Review.model.js';
// import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import mongoose from 'mongoose';
// import { WatchList } from '../models/Watchlist.model.js';
// import { Reply } from '../models/Reply.model.js';
// import { ReviewLike } from '../models/ReviewLike.model.js';

const generateAccessAndRefreshToken=async(userId)=>{
  try {
      const user=await User.findById(userId)
      if(!user){
          throw new ApiError(401,"User not found")
      }
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
  
      return {accessToken,refreshToken}
  } catch (error) {
    
    throw new ApiError(500,"Spmething wrong in generating Tokens")
  }
}
const userRegister=asyncHandler(async(req,res)=>{
    console.log('Request Body:', req.body);
    const {username,email,password}=req.body

    if([username,email,password].some((field)=>field?.trim==""))
        {
            throw new ApiError(400,"All field are required")
        }
    const existedEmail=await User.findOne({
        email:email
    })
    if (existedEmail){
        throw new ApiError(401,"User already Exist")
    }
    const existedUserName=await User.findOne({
        username:username
    })
    if (existedUserName){
        throw new ApiError(401,"Username already occupied")
    }
    const createUser=await User.create({
        username:username.toLowerCase(),
        email,
        password
    })
if(!createUser){
    throw new ApiError("Something wrong while creating account,Please retry after sometime")
}
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,createUser,"User Register Successfully"
        )
    )
})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({
        email:email
    })
    if(!user){
        throw new ApiError(401,"User not found")

    }
    console.log("error",user)
    const passwordCheck=await user.isPasswordCorrect(password)
    if(!passwordCheck){
        throw new ApiError(401,"Password is wrong")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    if (!accessToken|| !refreshToken){
        throw new ApiError(500,"Failed to generate Tokens")
    }

    const loggedIn=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
                user:accessToken,refreshToken,loggedIn
            },
            "User Login Successfully"
        )
     )
})

const logOutUser=asyncHandler(async(req,res)=>{
    console.log("helo")
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        } 
    )
    const options={
        httpOnly:true,
        secure:true,
        sameSite: "none",
    }

    return res.
    status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User Logout Successfully")
    )
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies.refreshToken || 
        req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401,"Invalid IncomingRefresh Token")
        }
    
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user= await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Unauthorized Token Access")
        }
    
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(400,"Refresh Token Not Matched")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const{accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,{
                    accessToken,refreshToken:newRefreshToken
                },
                "Access Token Refreshed"
                
            )
        )
    } catch (error) {
        throw new ApiError(400,error?.message||"Invalid Token access")
    }
})

const getUserDetails=asyncHandler(async(req,res)=>{
    // console.log("req",req.user)
    console.log("call")
    if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      else{
        res.status(200)
    .json(
      new ApiResponse(
        200,req.user,"Current User Fetched"
      )
    )
      } 
  })

  const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken"); // Excluding sensitive data
        if (!users || users.length === 0) {
            throw new ApiError(404, "No users found");
        }
        return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching users");
    }
});

export {userRegister,loginUser,logOutUser,refreshAccessToken,getUserDetails,
    generateAccessAndRefreshToken, getAllUsers}