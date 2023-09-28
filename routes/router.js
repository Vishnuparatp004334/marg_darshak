const express = require("express");
const router = new express.Router();
const userdb = require("../model/userSchema")
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const nodemailer = require("nodemailer");
let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "start112002up@gmail.com",
        pass: "sxdcthedvkukqlsk"
    }
})

// ------------------------------------for user registration----------------------
router.post("/register", async(req,res)=>{
    // console.log(req.body);
    const {fname, email, phone, password, cpassword} = req.body;
    if (!fname || !email || !phone || !password || !cpassword) {
        res.status(422).json({error: "fill all the details"})
    }
    try {
        const preuser = await userdb.findOne({email:email});

        if (preuser) {
            res.status(422).json({error:"This Email is already register"});
        }else if (password !== cpassword) {
            res.status(422).json({error:"This Password and Confirm Password is not matching"});
        }else{
    
            const finalUser = new userdb({
                fname,
                email,
                phone,
                password,
                cpassword
            })

            const storeData = await finalUser.save();
            console.log(storeData);
            let details = {
                from: "start112002up@gmail.com",
                to: "me20b1040@iiitdm.ac.in",
                subject: "new user fill the form",
                text: `new user fill form ${storeData}`
            }
            mailTransporter.sendMail(details, (err)=>{
                if (err) {
                    console.log("it has an error",err);
                }else{
                    console.log("email has sent");
                }
            })

            res.status(201).json({status:201,storeData})
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }
})
// ---------------------------------Login user-----------------------------------------

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Fill in all the details" });
    }

    try {
        const userValid = await userdb.findOne({ email: email });

        if (!userValid) {
            return res.status(401).json({ error: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, userValid.password);

        if (!isMatch) {
            return res.status(422).json({ error: "Invalid details. Please try again!" });
        }

        // Token generation and cookie setting
        const token = await userValid.generateAuthToken();
        res.cookie("usercookie", token, {
            expires: new Date(Date.now() + 11510640000),
            httpOnly: true,
        });

        // console.log(token);
        res.status(201).json({ status: 201, token });
    } catch (error) {
        res.status(500).json(error);
        console.log("Catch block error", error);
    }
});
router.get("/getuser", authenticate, (req,res)=>{
    res.send(req.rootUser)
})
router.get("/contact", authenticate, (req,res)=>{
    res.send(req.rootUser)
})

router.post("/message",authenticate, async(req,res)=>{
    const{fname,email, phone, whnumber, expert, problem} = req.body;
    // console.log(req.body);
    try {
        let user = await userdb.findOne({_id:req.userId});
        if (user) {
           const userMessage = await user.addMessage(fname,email,phone,whnumber,expert,problem);
        //    console.log(userMessage);
           const newUser = await user.save();
        //    console.log(newUser.messages);
           res.status(201).json(newUser)
        //    console.log(newUser);
           let details = {
               from: "start112002up@gmail.com",
               to: "me20b1040@iiitdm.ac.in",
               subject: "new user fill the form",
               text: `new user fill form ${newUser.messages}`
           }
           mailTransporter.sendMail(details, (err)=>{
               if (err) {
                   console.log("it has an error",err);
               }else{
                   console.log("email has sent");
               }
           })
        }
    } catch (error) {
        return res.status(422).json("you have error");
    }
})

router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("User logout");
});

module.exports = router;