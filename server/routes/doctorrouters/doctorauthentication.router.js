const doctorModel = require('../../models/doctor/doctor.model')
// const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { sendMail } = require('../../controllers/sendMail');

const router = express.Router();

// router.use(cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));

router.use(express.json());

router.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const { name, email, password, age, mobile, gender, specialization } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await doctorModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 12);

        // Create the new user
        await doctorModel.create({ name, email, password: hash, mobile, specialization })
            .then(user => res.json({ success: true }))
            .catch(err => res.status(500).json({ error: err + '  Failed to create user' }));

    } catch (err) {
        console.error('Signup error: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const { email, password } = req.body;
    try {
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ error: 'No record exists' });
        }
        const isPassowrdValid = await bcrypt.compare(password, doctor.password);
        if (!isPassowrdValid) {
            return res.status(401).json({ error: 'The password is incorrect' });
        }
        const token = jwt.sign({ email: doctor.email }, "jwt-secret-key", { expiresIn: '1h' });
        sendMail(email, "Welcome to MediConnect", `This is your OTP for login ${otp}.It will expire in 1 Hour\nThank You.\n\n\nTeam MediConnect`)
        console.log("OTP SENT TO MAIL")
        return res.status(200).json({ status: 'Success', token, doctor, otp });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;