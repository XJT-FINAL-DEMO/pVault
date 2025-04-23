import { userModel } from "../model/userModel.js";
import { doctorsModel } from "../model/doctorsModel.js";
import { registerUserMailTemplate, mailTransporter } from "../utils/mailing.js";
import doctorsValidator from "../validators/doctorValidator.js";
import { loginUserValidator, registerUserValidator, UpdateUserValidator } from "../validators/userValidator.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




// register user
export const registerUser = async (req, res) => {

    // validate user information
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error);
    }
    // check if users exist or not
    const user = await userModel.findOne({
        $or: [{ email: value.email }]
    })
    if (user) {
        return res.status(409).json('Esisting User')
    }
    // hash plaintex password
    const hashPassword = bcrypt.hashSync(value.password, 10);
    // create user records in database
    const newUser = await userModel.create({
        ...value, password: hashPassword
    });
    // generate access token for user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // send registration mail to user
    await mailTransporter.sendMail({
        from: process.env.USER_EMAIL,
        to: value.email,
        subject: "Welcome to pVault",
        html: registerUserMailTemplate.replace('{{lastName}}', value.lastName)
    })

    // return a response
    res.status(201).json({
        message: 'Successfully Registerd😊',
        user: newUser,
        token
    });
};

// controller for adding a dr
export const registerDoctor = async (req, res) => {

    // validate user information
    const { error, value } = doctorsValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error);
    }
    // check if users exist or not
    const user = await doctorsModel.findOne({
        $or: [{ email: value.email }]
    })
    if (user) {
        return res.status(409).json('Esisting User')
    }
    // hash plaintex password
    const hashPassword = bcrypt.hashSync(value.password, 10);
    // create user records in database
    const newUser = await doctorsModel.create({
        ...value, password: hashPassword
    });
    // generate access token for user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // send registration mail to user
    await mailTransporter.sendMail({
        from: process.env.USER_EMAIL,
        to: value.email,
        subject: "Welcome to pVault",
        html: registerUserMailTemplate.replace('{{lastName}}', value.lastName)
    })

    // return a response
    res.status(201).json({
        message: 'Successfully Registerd😊',
        user: newUser,
        token
    });
};


// login user
export const loginUser = async (req, res) => {
    try {
        // validate user info
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        const { email, password } = value;
        let user, role, model;

        // matching user records
        user = await userModel.findOne({email});
        //$or: [{ email: value.email }]
        if (user) {
            role = 'patient';
            model = userModel;
        } else {
            user = await doctorsModel.findOne({ email });
            if (user) {
                role = user.role;
            }
        }
        if (!user) {
            return res.status(404).json('User Not Found 😔')
        };

        // compare incoming password with sawved password
        const correctPassword = bcrypt.compareSync(password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Incorrect credetials 😔')
        }
        // generate access token for user(role will be assigned)
        const token = jwt.sign({ id: user._id, role: role },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );
        // return response
        res.status(200).json({
            message: 'Welcome Abord😁',
            token,
            user: {
                id: user.id,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error); 
        res.status(500).json({ message: 'Sever Error' });

    }
}
// update user details
export const updateUser = async (req, res) => {
    try {
        const { error, value } = UpdateUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ message: error.details[0].message });
        }
        // check if psswrd id beign updated
        if (value.password) {
            const hashPassword = await bcrypt.hash(value.password, 10);
            value.password = hashPassword;
        }

        // update user
        const updateUser = await userModel.findByIdAndUpdate(
            req.params.id, value, { new: true }
        );
        // return response
        const { password, ...userWithoutPassword } = updateUser.toObject();
        res.status(200).json({
            message: 'Upadte Successful',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Update User, Server Error' })

    }
}

// get all users 
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.json({ message: 'User Not Found!' })

    }
}