import mongoose,{ Schema, model } from "mongoose";

const medsSchema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required:true },
    quantity:{type:Number, required:true},
    manufacturer:{type:String, required:true},
    price:{type:Number, required:true},
    expiryDate:{Date},
    picture:[{String}],
    pharmacist:{type: mongoose.Schema.Type.ObjectId, ref:'User'}
},{timestamps:true});




// normalize schema ---
medsSchema.set("toJSON", {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
});

export const medsModel = model ('Medicine', medsSchema)
