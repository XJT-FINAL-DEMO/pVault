import {model,Schema} from 'mongoose';

const facilitySchema = new Schema({
    name:{type:String, required:true},//eg "korlebu"
    ype:{type:String, enum:["hospital","pharmacy", "labCenter"], required:true},
    location: {
        type:{type:String, default:"Point"}, //maps
        coordinates:{type:[number], required:true}//exact location
    },
    address:{ype:String, required:true},
    phone:{type:String},
    openingHours:[String],//"mon 6am-12am",....
    services:[String]
},{
    timestamps:true
});

// geospatial index for nearby search
facilitySchema.index({location:"2dsphere"});

export const facilityModel = model ("Facility", facilitySchema)
