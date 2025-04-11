import { required } from 'joi';
import {model,Schema} from 'mongoose';

const facilitySchema = new Schema({
    name:{type:String, required:true},//eg "korlebu"
    type:{type:String, enum:["hospital","pharmacy", "lab center"], required:true},
    location: {
        type:{type:String, default:"Point"}, //maps
        coordinates:{type:[number], required:true,
            validator: (coords) => coords.length == 2 &&
            coords[0] >= -180 && coords[0] <=180 && //longitude validation
            coords[1] >= -90 && coords[1] <=90,
            message:"Invalid coordinates!"
        }//exact location
    },
    address:{type:String, required:[true, "Address is Required"]},
    phone:{type:String,
        validator:(phone) => /^\d{10}$/.test(phone),
        message:"Invalid phone number!"
    },
    openingHours:[{
        day:{type: String, required:true},//"Mon", "Tues"...
        hours:{type: String, required:true} //"6:00 Am - 2:00 PM"
    }],
    services:[String]
},{
    timestamps:true
});

// geospatial index for nearby search
facilitySchema.index({location:"2dsphere"});

export const facilityModel = model ("Facility", facilitySchema)
