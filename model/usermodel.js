import mongoose, { model, Schema } from "mongoose";

// reqular user and dr schema
const userSchema = new Schema({
    firstName: { type: String, required: tru },
    lastName: { type: String, required: tru },
    email: { type: String, required: tru, unique: true },
    password: { type: String, required: true },
    role: {
        type: String, enum: ["patient", "doctor", "labTech", "pharmacist", "nurses", "admin"],
        default: 'patient' //set to default value as the patient
    },
    medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "medicalRecords" }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointments" }],
}, {
    timestamps: true
});


// normalize schema ---
userSchema.set("toJSON", {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
});

export const userModel = model("User", userSchema);