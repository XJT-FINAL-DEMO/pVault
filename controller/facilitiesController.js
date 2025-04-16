import { facilityModel } from '../models/facilityModel.js';


// add hospitals or pharmacy or lab center
export const addFacility = async (req, res) => {
    try {
        const newFacility =new facilityModel({
            ...req.body,
        }, { abortEarly: false });
        // validate facility type
        const validTypes = ["hospital", "pharmacy", "labCenter"];
        if (!validTypes.includes(newFacility.type)) {
            return res.status(400).json({error: "Invalid facility type! Use 'hospital', 'pharmacy', or 'labCenter'"});
        }
        await newFacility.save();
        res.status(201).json({message:`New${newFacility.type} Added Succefully🥳`})
    } catch (error) {
        if (error.name == 'ValidationError'){
            return res.status(400).json({
                error:"Validation failed 😞" + error.message
            });
        }
        return res.status(500).json({ error:"Something is Wrong😞"+ error.message })

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
