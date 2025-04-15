import { appointmentsModel, Appointments } from '../model/appointmentsModel.js';


// book appointment with dr and 
export const bookAppointment = async (req, res) => {
    try {
        //1.Get data from the request(user,doctor,data)
        const { userId, doctorId, date }
            = req.body;
        //2. Check if user and doctor exist
        const user = await user.findById(userId);
        const doctor = await doctor.findById(doctorId);
        if (!user || !doctor) {
            return res.status(404).json({ error: "User or doctor not found!" });
        }
        //3. Check if the doctor is available at that time
        const existingAppointment = await appointmentsModel.findOne({
            doctor: doctorId,
            date: date
        });
        if (existingAppointment) {
            return res.status(400).json({ error: "Doctor is busy! Pick another time" })
        }

        //4. Check if the date is in the future(nott in the past)
        if (newDate(date) < new Date()) {
            return res.status(400).json({ error: "Pick a future date" })
        }

        //Create the appointment
        const newAppointment = new appointmentsModel({
            user: userId,
            doctor: doctorId,
            date: date,
            status: "booked"
        });

        //send appointment confirmation email to user

        //Send a sucess response
        res.json({
            message: "Appointment booked!",
            appointment: newAppointment
        });

    } catch (error) {
        res.status(500).json({ error: "Robot crashed! Try again later" });
    }

};

// pre check in online 

export const preCheckIn = async (req,res) => {
    try {
        // get appointment id
        const {appointmentId} = req.body;
        const appointment = await userFindAppointment(appointmentId);

        if (!appointment) {
            return res.status(404).json({erro: "sorry we couldn't find your appoint ment. Try Agian!"})
        }
        appointment.status = 'checked-in';

        // update queue position randomly and find room
        appointment.queuePosition = Math.floor(Math.random() * 10) +1;
        const roomLocation = await userFindRoomLocation(appointment.randomNumber);
        // set the location based on room number
        appointment.location = roomLocation;
        await userSaveAppointment(appointment);

        // send email to user
        await drSendEmail(appointment.userEmail, appointment);
        res.json({
            message:"You're checked in!, Please check your email for details",
            appointment:{
                queuePosition: appointment.queuePosition,
                location: appointment.location
            }
        });
        // update the queue in-realtime
        userUpdateQueueInRealTime(appointmentId, appointment.queuePosition);

    } catch (error) {
        res.status(500).json({error:"Something went Wrong, Try again later.!"})
        
    }
}

// get/view user appointment details 
export const getAppointments = async (req, res) => {
    try {
        const {userId, role} =req.user;
        let appointments;
        if (role == "patient"){
            appointments = await Appointments.find({patient:userId}).populate('doctor','name speciality');
        } else if (role == "doctor"){
            appointments = await Appointments.find({doctor:userId}).populate('patient', 'name email');
        } else {
            return res.status(403).json({error:"Your neither a Patient or Dr"})
        }
        res.json({
            message: "See Your Appointments!",
            appointments
        })
    } catch (error) {
        res.status(500).jason({error:"It seems the booking is stuck"});
        
    }
}