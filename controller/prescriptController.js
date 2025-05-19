import { cloudinary } from "../middleware/upload.js";
import { prescriptModel } from "../model/prescriptModel.js";
import mongoose from "mongoose";

// Upload/post prescription .post/api/prescriptions 
export const addPrescription = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files Uploaded!" });
        }
        const fileUrls = req.files.map(file => file.path);
        const prescrioptionData = {
            ...req.body, pictures: fileUrls, userId: req.auth.id
        };

        const newPrescription = new prescriptModel(prescrioptionData);
        const validationError = newPrescription.validateSync();
        if (validationError) {
            return res.status(422).json({ message: 'Validation error', status: validationError.errors })
        }

        const result = await prescriptModel.create(prescrioptionData);
        return res.status(201).json(result.toObject());

    } catch (error) {
        console.error("Error creating prescription:", error);
        if (error.message.includes('JPG/PDF')) {
            return res.status(4409).json({ message: error.message })
        }
        return res.status(500).json({ message: "Hmm, Server Error, Refresh" })

    }
}


// list/get all prescription by filter of the status/pharmacist
export const getAllprescriptions = async (req, res) => {
    try {
        // get filter query

        const userId = req.auth.id; //authrized checking
        const userRole = req.auth.role;
        // console.log("req.auth:", req.auth);


        const filter = {};
        if (userRole == 'pharmacist') {
            filter.pharmacist = new mongoose.Types.ObjectId(userId);
        } else if (userRole == 'patient') {
            filter.patient = new mongoose.Types.ObjectId(userId);
        } else if (userRole == 'doctor') {
            filter.pharmacist = new mongoose.Types.ObjectId(userId);

        }else { return res.status(403).json({ error: 'Unauthorized access' }) }

        const { status } = req.query;
        if (status) {
            if (!['pending', 'approved', 'rejected', 'delivering', 'delivered'].includes(status)) {
                return res.status(400).json({ error: "invalide status filter" });
            }
        } filter.status = status;
        //   console.log("Filter being used:", filter);
        const prescriptions = await prescriptModel.find(filter)
            .populate('patient', 'name email')
            .populate('pharmacist', 'name email pharmacyName')
            .populate('medicines', 'name price dosage')
            .sort({ createdAt: -1 }); //latest first

            console.log("Prescriptions found:", prescriptions); // Add this line

        if (!prescriptions.length == 0) {
            return res.status(404).json({ message: "No Prescriptions Found!" })
        }
        res.status(200).json({
            message: "Available Prescriptions.",
            count: prescriptions.length, prescriptions
        })

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid Id format' });
        }
        res.status(500).json({ error: 'Hmm Server Issues' + error.message });
    }
};



// update/prescriptions by status
export const updatePrescription = async (req, res) => {
    try {
        const { status } = req.body;
        const prescription = prescription.findById(req.params.id).populate('medicines.medicine');

        // check prescription exist
        if (!prescription) {
            return res.status(404).json({ error: "Prescription Not Found" });
        }
        // verify allowed transaction
        const validTransactions = {
            pending: ['approved', 'rejected'], approved: ['delivering'],
            delivering: ['delivered'], rejected: [], delivered: []
        };

        if (!validTransactions[prescription.status].includes(status)) {
            return res.status(400).json({ error: `Cannot Change from ${prescription.status} to ${status}` });
        }

        switch (status) {
            case 'approved':
                for (const item of prescription.medicines) {
                    const medicine = await Medicine.findById(item.medicine._id);
                    if (medicine.quantity < item.quantity) {
                        return res.status(400).json({
                            error: `Insufficient stock for ${medicine.name}! (Available: ${medicine.quantity})`
                        });
                    }
                }
                // deduct from stock
                for (const item of prescription.medicines) {
                    const medicine = await Medicine.findById(item.medice._id);
                    medicine.quantity -= item.quantity;
                    await medicine.save();
                } break;

            case 'delivering': prescription.deliveryStatus = 'delivering';
                breake;
            case 'delivered': prescription.deliveryStatus = 'delivered';
                break;
        }

        // update status and save
        prescription.status = status;
        await prescription.save();

        res.jason({
            message: `Prescription status updated to ${status}!`,
            prescrioption: prescription.toJSON()
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid Prescription ID!' });
        }
        res.status(500).json({ error: "server error: " + error.message });

    }
}

// delete/cancle prescriptions
export const deletePrescription = async (req, res) => {
    try {
        const prescription = await prescriptModel.findByIdAndDelete(req.params.id)
        if (!prescription) {
            return res.status(404).json({ message: "Prescription Not Found" })
        }
        res.status(201).json({
            message: "Advert Permanently Deleted",
            data: prescription,
            status: 'success'
        })
    } catch (error) {
        return res.status(500).json({ message: "Request Not Successful, Refreh the App " + error.message })
    }
}