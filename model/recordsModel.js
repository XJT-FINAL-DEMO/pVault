import { date, required } from "joi";
import mongoose, { model,Schema } from "mongoose";


const recordsSchema =new Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true},
    hospital:{type:mongoose.Schema.Types.ObjectId, ref:"Facility"},
    diagnosis:[String],
    prescription:[String],//"med A","medicine B",...
    doctorNotes:{type:String},
    date:{type:Date, default:Date.now},
    attachments:[String],
    isDeleted:{Boolean,default:false},
    deletedAt:{type:Date,default:null}
},{
    timestamps:true
});

export const recordsModel = model("medicalRecords",recordsSchema)