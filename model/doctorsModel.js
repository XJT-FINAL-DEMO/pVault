import mongoose, {model,Schema} from 'mongoose';

const doctorsSchema = new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization:{type:String, required:true},
    license:{type: String, required: true},
    facility: [{type:mongoose.Schema.Types.ObjectId, ref:'Facility', required: true}],
    role:{type:String, enum:['pharmacist','doctor'], required: true},
    availability:[{
        day: [String], //days available
        slots:[String] //times available
    }]
},{
    timestamps:true
});

// normalize schema
doctorsSchema.set("toJSON", {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id;
        delete returnObject.__v;
    }
});


export const doctorsModel = model("Doctor", doctorsSchema);