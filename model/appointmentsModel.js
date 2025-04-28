import mongoose, { model, Schema } from 'mongoose';


const appointmentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "rescheduled", "Checked In"], default: "pending" },
    confirmationToken: {type: String},
    rescheduleHistory: [{ oldDate: Date, newDate: Date, changeAt: Date},{default:[]}],
    location: {type: String},
    notes: { type: String },//bring previouse test reports
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

}, {timestamps: true});

export const appointmentsModel = model("Appointments", appointmentSchema);