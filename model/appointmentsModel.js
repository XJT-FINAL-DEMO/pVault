import mongoose,{model,Schema} from 'mongoose';


const appointmentSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    doctor: {type:mongoose.SchemaTypes.ObjectId,ref:"Doctor",required:true},
    date: {type:Date,required:true},
    status:{type:String, enum:["pending","confirmed","cancelled"], default:"pending"},
    notes:{type:String}//bring previouse test repotss

},{
    timestamps:true
});

export const appointmentsModel = model("Appointments", appointmentSchema);