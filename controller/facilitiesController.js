import { facilityModel } from '../model/facilityModel.js';


// add hospitals
export const addHospitals = async (req, res) =>{
    try {
        const {error, value} = facilityModel({
            ...req.body,
        },{abortEarly: false})
    } catch (error) {
        
    }
}

//and labs 

//and pharmacy 



//find nearest facility ; hospital,pharmacy,labtech, 
export const getNearbyFacility = async (req, res) => {
    try {
        // 
        const { searchTerm } = req.query; //user only send search word

        // validate map search term to facility
        const typeMap = {
            hospital: 'hospital',
            pharmacy: 'pharmacy',
            'lab center': 'lab center',
            'medical lab': 'lab center'
        };
        const facilityType = typeMap[searchTerm.toLowerCase()];
        if (!facilityType) {
            return res.status(400).json({ error: "Search 'hospital','pharmacy, or 'lab center'!" });
        }

        // get longitude and latitude from front end
        let { lat, lng } = req.query;
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
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
        res.status(500).json({ error: "Server error" })

    }
};
