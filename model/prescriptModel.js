import mongoose, { Schema, model } from 'mongoose';

const prescriptionSchema = new Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    pictures: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'deilivering', 'delivered'], 
        default: "pending"
    },
    medicines: {type: mongoose.Schema.Types.ObjectId, ref: "Medication" },
    quantity: {type: Number},
    deliveryAddress: { type: String, required: true },
    deliveryStatus: {
        enum: ['pending', 'delivering', 'delivered']
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (ret) => {
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