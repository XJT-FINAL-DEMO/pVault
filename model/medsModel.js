import mongoose, { Schema, model, Types } from "mongoose";

const medsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    // picture:{type:[String]},
    pharmacist: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });






// normalize schema ---
medsSchema.set("toJSON", {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
});

export const medsModel = model('Medicine', medsSchema)
