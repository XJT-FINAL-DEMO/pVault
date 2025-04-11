import mongoose, {model,Schema} from 'mongoose';

const doctorsSchema = new Schema({
    name:{type:String, requird:true},
    speciality:{type:String, required:true},
    hospital:{type:mongoose.Schema.Types.ObjectId, ref:"Facility"},
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
        delete returnObject._id
        delete returnObject.__v
    }
});


export const doctorsModel = model("Doctor", doctorsSchema);