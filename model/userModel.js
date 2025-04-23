import mongoose, {Schema,model} from "mongoose";
// import mongoose from "mongoose";

// reqular user and dr schema
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth:{type: Date, required: true},
    role: {type: String, enum: ["patient", "admin"],
        default: 'patient' //set to default value as the patient
    },
    // medicalRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: "medicalRecords" }],
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
