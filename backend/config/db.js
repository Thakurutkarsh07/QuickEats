import  mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://quickeatsdb:dbquickeats@quickeats.qfuon.mongodb.net/quick-eats')
    .then (()=>{
        console.log('MongoDB connected...')
    })
}
