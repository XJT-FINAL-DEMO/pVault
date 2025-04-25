import { appointmentsModel } from '../model/appointmentsModel.js';
import { doctorsModel } from '../model/doctorsModel.js';
import { userModel } from '../model/userModel.js';
import { appointmentConfirmationMailTemplate, mailTransporter } from '../utils/mailing.js';
import jwt from 'jsonwebtoken';


// book appointment with dr and 
export const bookAppointment = async (req, res) => {
    try {
        //Get data from the request(user,doctor,data)
        const { userId, doctorId, date }
            = req.body;
        //Check if user and doctor exist
        const user = await userModel.findById(userId);
        const doctor = await doctorsModel.findById(doctorId);
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
        if (new Date(date) < new Date()) {
            return res.status(400).json({ error: "Pick a future date" })
        }
        //Create the appointment
        const newAppointment = new appointmentsModel({
            user: userId,
            doctor: doctorId,
            date: date,
            status: "pending",
        });
        await newAppointment.save();
        // generate confirmation token jwt
        const confirmationToken = jwt.sign({
            appointmentId: newAppointment._id, type: 'Confirmation'
        }, process.env.JWT_SECRET, { expiresIn: '30minutes' })

        console.log("Generated Confirmation Token:", confirmationToken);
        //send appointment confirmation email to user
        const confirmationLink = `${process.env.BASE_URL}/confirm/${confirmationToken}`;
        const htmlContent = appointmentConfirmationMailTemplate.replace('{{lastName}}', user.lastName).replace('{{confirmationLink}}', `<a href="${confirmationLink}">Confirm</a>`)
        await mailTransporter.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "You have sucessfully created an appointment with pVault",
            html: htmlContent
        })

        //Send a sucess response
        res.json({
            message: "Appointment booked!",
            appointment: newAppointment
        });
    } catch (error) {
        res.status(500).json({ error: "Server crashed! Try again later" });
    }

};

// confirm appointment 
// export const confirmAppointment = async (req, res) => {
//     try {
//         const { appointmentId } = req.params;
//         // verify jwt and validate 
//         const doctorId = req.auth.id

//         // find appointment and update status 
//         const appointment = await appointmentsModel.findOne({
//             _id: appointmentId,
//             doctor: doctorId,
//             status: 'Pending'
//         });

//         if (!appointment) {
//             return res.status(400).json({
//                 error: "Appointment Not Found or Already Confirmed"
//             });
//         }
//         appointment.status = 'Doctor Confirmed';
//         await appointment.save();
//         return res.status(200).json({ message: 'Appointment confirmed successfully' });

//     } catch (error) {
//         console.error('error confirming appointment', error);
//         res.status(500).json({ error: "Confirmation Failed, Refresh!" })

//     }
// }


// rechedule appointments [dr & patients]
export const reschedulAppointment = async (req, res) => {
    try {
        const { newDate } = req.body;
        const appointment = await appointmentsModel.findById(req.params.id);

        if (!appointment) {
            return res.status(403).json({ error: "Appointment Not Found" });
        }
        if (appointment.user.toString() !== req.auth.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const rescheduleDate = new Date(newDate);
        const now = new Date();
        if (rescheduleDate < now) {
            return res.status(400).json({ error: "Pick a Future Date" })
        }

        // check dr available
        const existingAppointment = await appointmentsModel.findOne({
            doctor: appointment.doctor,
            date: newDate,
            _id: { $ne: appointment._id }
        });

        if (existingAppointment) { return res.status(400).json({ message: "Doctor is busy at this time" }); }

        // update appointment
        appointment.rescheduleHistory.push({
            oldDate: appointment.date,
            newDate: newDate,
            changedAt: new Date()
        });
        await appointment.save();


        // send mail to confirm reschedul
        // await mailTransporter.sendMail({
        //     to: req.user.email,
        //     subject: "Appointment Reschedule",
        //     html: addEmailtemplate(newDate)//replace the new template leave the (newDate)
        // });
        res.json({
            message: 'Appointment rescheduled',
            data: appointment
        })

    } catch (error) {
        res.status(500).json({ error: 'Rescheduled Failed' })
    }
}

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
        const { userId, role } = req.auth;
        let appointments;
        if (role == "patient") {
            appointments = await appointmentsModel.find({ user: userId }).populate('doctor', 'name speciality');
        }

        else if (role == "doctor") {
            console.log("req.auth:", req.auth.id);
            appointments = await appointmentsModel.find({ doctor: userId }).populate('patient', 'name email');
            console.log("Retrieved appointments:", appointments);
        }

        else if (role == "pharmacist") {
            appointments = await appointmentsModel.find({ pharmacist: userId }).populate('pharmacist', 'name email');
        }

        else {
            return res.status(403).json({ error: "Your neither a Patient, nor Dr" })
        }
        res.json({
            message: "See Your Appointments!",
            appointments

        })
        console.log(appointments)
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "It seems the booking is stuck" })


    }
}

// delete appointment [delete]
export const cancelAppointment = async (req, res, next) => {
    try {
        // find appointment
        const appointment = await appointmentsModel.findById(req.params.Id).populate('user doctor', 'id');
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not Found" });
        }
        const isPatient = req.auth.id == appointment.user._id.toString();
        const isDoctor = req.auth.id == appointment.user._id.toString();
        if (!isPatient && !isDoctor) {
            return res.status(403).json({ error: "Unauthorized, You can delte your Own appointments Only" });
        }
        appointment.isDeleted = true;
        appointment.deletedAt = new Date();
        await appointment.save();
        res.status(200).json({
            message: "Appointment cancelled Successfully",
            data: appointment,
            deletedAt: appointment.deletedAt
        });;



    } catch (error) {
        if (error.name = 'CastError') {
            return res.status(400).json({ error: 'Malformed Appointment id' });
        }
        console.error('Delete appointment error', error);
        res.status(500).json({ error: "Failed to cancel appointment, please try again later" });
    }
}