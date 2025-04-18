import mongoose, { Schema, model } from 'mongoose';

const prescriptionSchema = new Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', requuired: true },
    pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', requuired: true },
    pictures: [{ type: String, requuired: true }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'deilivering', 'delivered'], default: 'pending'
    },
    medicines: [{
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medication" }, quantity: Number
    }],
    deliveryAddress: { type: String, requuired: true },
    deliveryStatus: {
        enum: ['pending', 'delivering', 'delivered'], default: 'pending'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id.toString()
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});



// normalize schema ---
prescriptionSchema.index({status:1});
prescriptionSchema.index({deliveryStatus:1});

export const prescriptModel = model('Prescriptions', prescriptionSchema)