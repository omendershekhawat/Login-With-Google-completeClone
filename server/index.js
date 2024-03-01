import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "./db/conn.js"
const PORT = 6005;

import session from "express-session";
import passport from "passport";
import OAuth2Strategy from 'passport-google-oauth2'
import userdb from "./model/userSchema.js"



const clientid = "31428249235-mi2bj2ekimfunu1jqn1dive7f9vikm89.apps.googleusercontent.com"
const clientsecret = "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"

const app = express()


app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET , POST , PUT DELETE",
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: "123654omender",
    resave: false,
    saveUninitialized: true
}))

// app.get("/",(req,res)=>{
//     res.status(200).json("server start")
// });

//set-up-passport
app.use(passport.initialize());
app.use(passport.session());




passport.use(
new OAuth2Strategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"]
},
    async (accessToken, refreshToken, profile, done) => {
        // console.log("profile", profile)
        try {
            let user = await userdb.findOne({ googleId: profile.id })
            if (!user) {
                user = new userdb({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value
                });
                await user.save();
            }
            return done(null, user)
        } catch (error) {
            return done(error, null)

        }
    }
)

)

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user)
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login"
}))


app.get("/login/sucess",async(req,res)=>{
  
    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"not Authorised"})
    }
    
})
app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if (err){return next(err)}   
        res.redirect("http://localhost:3000")
     })
})

app.listen(PORT, () => {
    console.log(`servwr started at port no ${PORT}`)
})


