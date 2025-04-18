import { facilityModel } from '../model/facilityModel.js';


// add hospitals or pharmacy or lab center
export const addFacility = async (req, res) => {
    try {
        const newFacility = new facilityModel({
            ...req.body,
            pictures: req.files?.map((file) => { return file.filename })
        }, { abortEarly: false });
        // validate facility type
        const validTypes = ["hospital", "pharmacy", "lab Center"];
        if (!validTypes.includes(newFacility.type)) {
            return res.status(400).json({ error: "Invalid facility type! Use 'hospital', 'pharmacy', or 'labCenter'" });
        }
        await newFacility.save();
        res.status(201).json({ message: `New${newFacility.type} Added Succefully🥳` })
    } catch (error) {
        if (error.name == 'ValidationError') {
            return res.status(400).json({
                error: "Validation failed 😞" + error.message
            });
        }
        return res.status(500).json({ error: "Something is Wrong😞" + error.message })

    }
}

// get all facilities with search and filter
export const getFacilities = async (req, res) => {
    try {
        const { filter = "{}", sort = "{}" } = req.query;
        const result = await facilityModel.find({ ...JSON.parse(filter), isDeleted: false }).sort(JSON.parse(sort));
        if (result.length === 0) {
            return res.status(404).json({ message: "NOT found!" })
        }

        res.json({ message: "Here are your facilities", data: result })
    } catch (error) {
        return res.status(500).json({ message: "Request not Succesful, Refersh!" + error.message })
    }
}

// get facility by user
export const getfacilityByUser = async (req, res) => {
    try {
        const { filter = "{}", sort = "{}" } = req.query;
        const result = await facilityModel.find({ ...JSON.parse(filter), userId: req.params.userId, isDeleted: false }).sort(JSON.parse(sort));
        if (result.lenght === 0) {
            return res.status(404).json({ message: "No Facilitty Attached to Your Id" })
        }
        res.json({ message: "Here are you Posted Facilities" })

    } catch (error) {
        return res.status(500).json({ message: "Request not Succesful, Refersh!" + error.message })
    }
}


// patch/update a facilitt
export const updateFacility = async (req, res) => {
    try {
        const { error } = facilityModel.validate(req.body);
        const validTypes = ["hospital", "pharmacy", "lab Center"];
        if (!validTypes.includes(newFacility.type || error)) {
            return res.status(400).json({ error: "Invalid facility type! Use 'hospital', 'pharmacy', or 'lab Center'" + error.message });
        }
        // find facility by id
        const confirmFacility = await facilityModel.findById(req.params.id)
        if (!confirmFacility) {
            return res.status(404).json({ message: 'No Facility Found, confirm it Exist!' })
        }
        // confirm user is authorized to update
        if (confirmFacility.userId.toString() !== req.auth.id) {
            return res.status(403).json({ message: 'You are Not Authorized to Update Facility, Contact your Admin' })
        }
        const result = await facilityModel.findByIdAndUpdate(req.params.id, value, { new: true })
        if (!result) {
            return res.status(404).json({ message: 'Faclity Not Found, Create It' + error.message })
        }
        res.status(200).json({ message: 'Update successful', data: result })
    } catch (error) {
        return res.status(500).json({ messge: 'Request not sucessful, kindly refrsh or contact Admin' + error.message })
    }
}


//find nearest facility ; hospital,pharmacy,labtech, 
export const getNearbyFacility = async (req, res) => {
    try {
        // 
        const { searchTerm, lat, lng } = req.query; //user only send search word and auto detected location from the front

        // validate map search term to facility
        const typeMap = {
            hospital: "hospital",
            pharmacy: "pharmacy",
            'lab center': "lab center",
            'medical lab': "lab center"
        };
        const facilityType = typeMap[searchTerm.toLowerCase()];
        if (!facilityType) {
            return res.status(400).json({ error: "Search 'hospital','pharmacy, or 'lab center'!" });
        }

        // check if auto location detected are numbers
        if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            return res.status(400).json({ error: "Location access denied! Allow Location 🌍" });
        }

        // find nearby facility
        const facilities = await facilityModel.find({
            type: facilityType,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 5000 //5km radius
                }
            }
        }).limit(20);
        res.json({
            message: `Found ${facilities.length} ${searchTerm}(s)!🥳`,
            facilities
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });

    }
};


// delete facility soft delete
// export const deleteFacility = async (req, res) => {
//     try {
//         const { error, value } = facilityModel.validTypes(req.params, { abortEarly: false })
//         if (error) {
//             return res.status(400).json({ message: 'Validation Unsuccesful' + error.message })
//         }
//         const confirmFacility = facilityModel.findById(req.params.id)
//         if (!confirmFacility) {
//             return res.status(400).json({ message: 'Facility Not Found' })
//         }
//         if (confirmFacility.userId.toString() !== req.auth.id) {
//             return res.status(403).json({ message: 'You arre not Authorized to delete Facility' })
//         }
//         const result = await facilityModel.findByIdAndDelete(value.id, { isDeleted: true, deletedAt: new Date() }, { new: true })
//         if (!result) { return res.status(404).json({ message: 'Facility not Found' + error.message }) }
//         res.status(201).json({message:'Facility Deleted', data:result,status:'Successful'})
//     } catch (error) {

//     }
// }