import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import PayusersModel from "./model/PayusersModel.js";
import mongoose from "mongoose";
import TransactionModel from "./model/TransactionModel.js";
import crypto from "crypto";
// import base62 from "base62/lib/ascii.js";
import base64url from "base64url";
import Cookies from "js-cookie";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'



// import { createHash } from 'node:crypto';


import { createHash } from "node:crypto";
import { error } from "console";

let phone_glob;

dotenv.config()

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


const conn=process.env.MONGO

mongoose
  .connect(conn)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await PayusersModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = {
      uname: name,
      email: email,
      password: hashedpassword,
      phone: phone,
      amount: 1000,
    };
    console.log("new user is ", newUser);
    await PayusersModel.create(newUser);
    console.log("after succesfully inserting");
    res.status(200).json({ message: "Registration Completed" });
  } catch (error) {
    console.log("Error Occurred at server 69: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { password, phone } = req.body;
    console.log("password is ", password);
    console.log("phone is ", phone);
    if (!phone || !password) {
      return res
        .status(201)
        .json({ message: "Phone and password are required" });
    }

    const existingUser = await PayusersModel.findOne({ phone: phone });
    console.log("the user is ", existingUser);
    if (!existingUser) {
      return res.status(201).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(201).json({ message: "Invalid Password" });
    }
    console.log("before the  cookie is stored ",phone)
    const key=process.env.KEY
    const token = jwt.sign({ id: existingUser.uname }, key, { expiresIn: '1h' });
    const expirationDate = new Date(Date.now() + 3600000);
    res.cookie("acctoken", token, { expires:expirationDate, httpOnly: true });
    res.cookie("uid", phone, { expires:expirationDate, httpOnly: true });
    console.log("Token stored:", token); // Log the token for debugging
    console.log("token stored : ",phone);
    // phone_glob=phone
    return res.status(200).json({ message: "Logged in Succesful",token,phone });
  } catch (error) {
    console.log("Error Occurred at dummyserv 102: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getUsering", (req, res) => {

  const cookie_phone =req.cookies.uid;
  phone_glob=cookie_phone
  console.log("the stored cookie is ",cookie_phone)
  PayusersModel.findOne({ phone: phone_glob })
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/getHistory", async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      $or: [{ sender: phone_glob }, { receiver: phone_glob }],
    }).sort({ time: -1 });
    if(transactions.length<1)
      {
        return res.status(201).json({message:'no recent transactions'})
      }

    return res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/payment", async (req, res) => {
  try {
    let { phone, sendamount } = req.body;
    console.log("phone is ", phone);
    console.log("amount is ", sendamount);
    sendamount = parseInt(sendamount);
    if (!phone || !sendamount) {
      return res.status(201).json({ message: "Phone and amount are required" });
    }

    const receiver = await PayusersModel.findOne({ phone: phone });
    console.log("the user is  ", receiver.amount);
    if (!receiver) {
      return res.status(201).json({ message: "User not found" });
    }
    const receiver_name = receiver.uname;
    const receiveramount = parseInt(receiver.amount);
    const sender = await PayusersModel.findOne({ phone: phone_glob });
    console.log("the details about the sender is : ", sender);
    const senderamount = parseInt(sender.amount);
    const send_num_amount = parseInt(sendamount);
    if (senderamount < send_num_amount) {
      console.log("the amount is insufficient");
      return res.status(201).json({ message: "Insufficient Balance" });
    }
    const sender_name = sender.uname;
    PayusersModel.findOneAndUpdate(
      { phone: phone },
      { $set: { amount: receiveramount + sendamount } },
      { new: true }
    )
      .then((updatedDoc) => {
        console.log(updatedDoc);
      })
      .catch((error) => {
        console.log("error at server 98");
      });
    PayusersModel.findOneAndUpdate(
      { phone: phone_glob },
      { $set: { amount: senderamount - sendamount } },
      { new: true }
    )
      .then((updatedDoc) => {
        console.log(updatedDoc);
      })
      .catch((error) => {
        console.log("error at server 119");
      });
    const date = Date.now();
    const concatenatedString = `${sender_name}${sendamount}${receiver_name}${date}`;
    const saltRounds = 12;
    const hash = await bcrypt.hash(concatenatedString, saltRounds);

    const base64Hash = base64url(hash);
    console.log("before reduced to 10 : ", base64Hash);
    const Tid = base64Hash.slice(14, 26);
    console.log("Encrypted using bcrypt is : ", Tid);
    const newTransaction = {
      sender: phone_glob,
      sender_name: sender_name,
      receiver: phone,
      receiver_name: receiver_name,
      time: date,
      Transaction_id: Tid,
      amount: sendamount,
    };
    console.log("new trasaction is ", newTransaction);
    await TransactionModel.create(newTransaction);
    console.log("after succesfully inserting to transaction");

    return res.status(200).json({ message: "updated succesfully " });
  } catch (error) {
    console.log("Error Occurred at dummyserv 102: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/takeloan", async (req, res) => {
  try {
    const { lamount } = req.body;
    // console.log("the passed value is ", lamount);
    const liamount = parseInt(lamount);
    // console.log("the converted value is : ", liamount);
    const loan_user = await PayusersModel.findOne({ phone: phone_glob });
    // console.log("the details about loan user is : ", loan_user);
    const cur_loan = loan_user.loan_amount;
    const cur_amount = parseInt(loan_user.amount);
    // console.log("the current loan is ", cur_loan);
    if (cur_loan > 5000) {
      console.log("entered the not sanctioned part")
      return res
        .status(201)
        .json({
          message:
            "Loan cannot be sanctioned because you have taken the limit of the amount",
        });
    }
    const loan_sanction = new Date();
    console.log("the updated loan amount is : ", cur_loan + liamount);
    console.log("the updated amount is : ", cur_amount + liamount);
    console.log(loan_sanction);
    PayusersModel.findOneAndUpdate(
      { phone: phone_glob },
      {
        $set: {
          loan_amount: cur_loan + liamount,
          loan_s_date: loan_sanction,
          amount: cur_amount + liamount,
        },
      },
      { new: true }
    )
      .then((updated_loan) => console.log("updated succesfully ", updated_loan))
      .catch((error) => console.log("error in updatinf 203 : ", error));
    return res.status(200).json({ message: "loan sanctioned" });
  } catch (err) {
    console.log("error is present");
    res.status(500).json({ message: "internal server error" });
  }
});

const verifyUser = async (req,res,next)=>
  {
    const key=process.env.KEY;
    console.log("the key is ",key)
    try
    {
      const token = req.cookies.acctoken;
      console.log("the token is for authenticating : ",token)
      if(!token)
      {
        return res.json({status:false,message:"no token"})
      }
      const decoded=jwt.verify(token,key);
      next();
    }
    catch(e)
    {
      return res.json(e);
    }
  }
  
  app.get('/auth/verify',verifyUser,(req,res)=>
  {
    return res.json({status:true,message:"authorized"});
  })
  
  app.get('/auth/logout',(req,res)=>
  {
    res.clearCookie('acctoken')
    res.clearCookie('uid')
    return res.json({status:true})
  })


app.listen(8080, () => {
  console.log("the server is running fine");
});
