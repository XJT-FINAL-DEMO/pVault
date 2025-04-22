import { medsModel } from "../model/medsModel.js";
import { medsValidator } from '../validators/medsValidator.js'

// Upload/post medication .post/api/prescriptions 
export const addMedicine = async (req, res) => {
    try {
        const { error, value } = medsValidator.validate(
            req.body, {abortEarly: false}
        );
        if (error) {

            return res.status(422).json({ message: 'validation error ', details: error.details.map(detail => detail.message) });
        }
        const existingMedicine = await medsModel.findOne({name:value.name});
        if (existingMedicine) {
            return res.status(409).json({error:`Medicine '${value.name}' already exists`});
        }
        const newMedicine = await medsModel.create({
            ...value, pharmacist: req.auth.id
        });
        return res.status(201).json({ 
            message: "Product Added!",
            data:newMedicine, id:newMedicine._id
        })
    } catch (error) {
        if (error.name === "MongooseError") {
            return res.status(409).json({ message: "Request Not Succesful " + error.message })
        }
        console.error("medicine creation error:", error),
        res.status(500).json({
            error:"Failed to add medicine. Please try again Later"
        });
    }
}

// list/get all medicinesby filter of the status/
export const getAllMedicines = async (req, res) => {
    try {
        // initial safe default
        const {page = 1, limit = 10, sort = '-createdAt', ...filter} = req.query;

        // build the query
        const query = {isDeleted: false};
        const allowedFilters = ['name', 'price', 'manufacturer', 'quantity'];
        
        Object.keys(filter).forEach(key =>{
            if (allowedFilters.includes(key)) {query[key] = filter[key]}
        })
       
        const results = await medsModel.find({ ...JSON.parse(JSON.stringify(filter)), isDeleted: false }).sort(JSON.parse(sort));
        if (results.length === 0) {
            return res.status(404).json({ message: "No Medicine Found" })
        }
        res.status(201).json({ message: "See your Search", data: results })
    } catch (error) {
        res.status(409).json({ message: "Request not succesfull " + error.mesaage })
    }
}

// update medicines stock
export const updateMedicine = async (req, res) => {
    try {
        const { error, value } = medsValidator.validate(req.body,{abortEarly: false})
        if (error) {
            return res.status(422).json({ message: "Validation Error " + error.message })
        }
        const confirmMedicine = await medsModel.findById(req.params.id)
        if (!confirmMedicine) {
            return res.status(404).json({ message: "Product not Found" })
        }
        if (confirmMedicine.userId.toString() !== req.auth.id) {
            return res.status(401).json({ message: "UnAuthorized Access" })
        }
        const updateMedicine = await medsModel.findByIdAndUpdate(req.params.id, value, { new: true })
        if (!results) { return res.json({ mesaage: "Product not found" }) }
        res.status(200).json({ message: "Product Succefully Updated", data: updateMedicine })
    } catch (error) {
        return res.status(500).json({ message: "Not successful, please Refresh " + error.message })
    }
}

// delete/remove medicines
export const deleteMedicine = async (req, res) => {
    try {
        const medicine = await medsModel.findByIdAndDelete(req.params.id);
        if (medicine) {
            res.status(201).json(`${medicine} successfuly deleted`)
        } else {
            res.status(400).json(`${medicine} not found`)
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error " + error.message })
    }
}