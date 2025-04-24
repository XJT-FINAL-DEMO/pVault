import { appointmentsModel } from '../model/appointmentsModel.js';
import { appointmentConfirmationMailTemplate, mailTransporter} from '../utils/mailing.js';
import jwt from 'jsonwebtoken';


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
            status: "pending",
        });
        // generate confirmation token jwt
        const confirmationToken = jwt.sign({
            appointmentId: newAppointment._id, type: 'Confirmation'
        }, process.env.JWT_SECRET, { expiresIn: '30mnutes' })

        //send appointment confirmation email to user
        const confirmationLink = `${process.env.BASE_URL}/confirm/${confirmationToken}`;
        await mailTransporter.sendMail({
            from: process.env.USER_EMAIL,
            to: value.email,
            subject: "You have sucessfully created an appointment with pVault",
            html: appointmentConfirmationMailTemplate.replace('{{lastName}}', value.lastName)`<a href="${confirmationLink}">Confirm</a>`
        })

        //Send a sucess response
        res.json({
            message: "Appointment booked!",
            appointment: newAppointment
        });
        console.log(newAppointment)

    } catch (error) {
        res.status(500).json({ error: "Server crashed! Try again later" });
    }

};

// rechedule appointments [dr & patients]
export const reschedulAppointment = async (req, res) => {
    try {
        const { newDate } = req.body;
        const appointment = await appointmentsModel.findById(req.params.id);

        if (appointment.user.toString() !== req.auth.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        if (new Date(newDate) < new Date()) {
            return res.status(400).json({ error: "Pick a Future Date" })
        }

        // check dr available
        const existing = new appointmentsModel.findOne({
            doctor: appointment.doctor,
            date: newDate,
            _id: { $ne: appointment }
        });

        if (existing) { return res.status(400).json({ message: "Doctor is busy at this time" }); }

        // update appointment
        appointment.rescheduleHistory.push({
            oldDate: appointment.date,
            newDate: newDate,
            changedAt: newDate
        });

        appointment.date = newDate;
        appointment.status = 'rescheduled';
        await appointment.save();

        // send mail to confirm reschedul
        await mailTransporter.sendMail({
            to: req.user.email,
            subject: "Appointment Reschedule",
            html: addEmailtemplate(newDate)//replace the new template leave the (newDate)
        });
        res.json({
            message: 'Appointment rescheduled',
            data: appointment
        })

    } catch (error) {
        res.status(500).json({ error: 'Rescheduled Failed' })
    }
}

// confirm appointment 
export const confirmAppointmet = async (req, res) => {
    try {
        const { token } = req.params;
        // verify jwt and validate 
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode.type !== 'confirmation') {
            return res.status(400).json({ error: 'Invalide token type' });
        }
        // find appointment and update status 
        const appointment = await appointmentsModel.findOne({ _id: decode.appointmentId, status: 'Pending' });

        if (!appointment) {
            return res.status(400).json({
                error: "Appointment Not Found or Already Confirmed"
            });
        }
        appointment.status = 'confirmed';
        appointment.confirmationToken = undefined;
        await appointment.save();

    } catch (error) {
        if (error.name == "TokenExpiredError") {
            return res.status(400).json({ error: "Confirmation link expired" });
        }
        if (error.name == "JsonWebTokenError") {
            return res.status(400).json({ error: "Invalide Token" });
        }
        res.status(500).json({ error: "Confirmation Failed, Refresh!" })

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