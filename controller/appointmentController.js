import { appointmentsModel } from '../model/appointmentsModel.js';
import { appointmentConfirmationMailTemplate, preCheckInMailTemplate } from '../utils/mailing.js';


// book appointment with dr and 
export const bookAppointment = async (req, res) => {
    try {
        //Get data from the request(user,doctor,data)
        const { userId, doctorId, date }
            = req.body;
        //Check if user and doctor exist
        const user = await user.findById(userId);
        const doctor = await doctor.findById(doctorId);
        if (!user || !doctor) {
            return res.status(404).json({ error: "User or doctor not found!" });
        }
        //Check if the doctor is available at that time
        const existingAppointment = await appointmentsModel.findOne({
            doctor: doctorId,
            date: date
        });
        if (existingAppointment) {
            return res.status(400).json({ error: "Doctor is busy! Pick another time" })
        }

        //Check if the date is in the future(nott in the past)
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
        await mailTransporter.sendMail({
                from:process.env.USER_EMAIL,
                to: value.email,
                subject: "You have sucessfully created an appointment with pVault",
                html: appointmentConfirmationMailTemplate.replace('{{lastName}}', value.lastName)
            })

        //Send a sucess response
        res.json({
            message: "Appointment booked!",
            appointment: newAppointment
        });

    } catch (error) {
        res.status(500).json({ error: "Robot crashed! Try again later" });
    }

};

// rechedule appointments [dr & patients]



// pre check in online 
export const CheckIn = async (req, res) => {
    try {
        // get the appointment info by id from patient
        const { appointmentId } = req.body;
        const appointment = await patientFindAppointment(appointmentId);

        if (!appointment) {
            return res.status(400).json({ error: "Sorry, we couldn't find appointment" });
        } appointment.status = "Checked In";

        // updat queue poisition
        appointment.queuePosition = Math.floor(Math.random() * 3) + 1;

        appointment.location = "treys house";

        await patientnewAppointment.save(appointment);

        // send confirmation
        await confirmSendEmail(appointment.userEmail, appointment);
        // confirmation details
        res.json({
            message: "You've been Checked In",
            appointment: {
                queuePosition: appointment.queuePosition, location: appointment.location
            }
        });

        // update real time queue positiion
        queueRealTimeUpdate(appointmentId, appointment.queuePosition);

    } catch (error) {
        res.status(500).json({ error: "Something went Wrong, Try again later.!" });
    }
}

// get/view user appointment details 
export const getAppointments = async (req, res) => {
    try {
        const { userId, role } = req.user;
        let appointments;
        if (role == "patient") {
            appointments = await appointments.find({ patient: userId }).populate('doctor', 'name speciality');
        } else if (role == "doctor") {
            appointments = await appointments.find({ doctor: userId }).populate('patient', 'name email');
        } else if (role == "pharmacist") {
            appointments == await appointments.find({ pharmasist: userId }).populate('pharmacist', 'name email');
        } else {
            return res.status(403).json({ error: "Your neither a Patient, Nurse nor Dr" })
        }
        res.json({
            message: "See Your Appointments!",
            appointments
        })
    } catch (error) {
        res.status(500).jason({ error: "It seems the booking is stuck" })

    }
}

// delete appointment [soft delete]

// view deleted Appointment

// restore appointment

// admin permanently delete appointment