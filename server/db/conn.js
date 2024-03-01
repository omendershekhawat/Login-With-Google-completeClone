import mongoose, { connect } from "mongoose";

const DB = "mongodb+srv://omendershekhawat1:omendershekhawat1@cluster0.udbjtcv.mongodb.net/MERNLoginGoogle?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(DB, {
    useUnifiedTopology:true,
    useNewUrlParser:true    
}).then(()=>console.log ("database connected")).catch((err)=>console.log("err",err))