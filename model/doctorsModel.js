import { required, types } from 'joi';
import mongoose, {model,Schema} from 'mongoose';

const doctorsSchema = new Schema({
    firstName:{type:String, requird:true},
    lastName:{type:String, requird:true},
    email:{type: email, required: true},
    specialization:{type:String, required:true},
    lincense:{typ: String, requird: true},
    facility: {type:mongoose.Schema.Types.ObjectId, ref:'Facility'},
    role:{type:String, enm:['pharmacist','doctor']},
    availability:[{
        day: [String], //days available
        slots:[String] //times available
    }]
},{
    timestamps:true
});

// normalize schema
userSchema.set("toJSON", {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id;
        delete returnObject.__v;
    }
});


export const doctorsModel = model("Doctor", doctorsSchema);