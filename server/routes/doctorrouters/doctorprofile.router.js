const doctorModel = require('../../models/doctor/doctor.model')
const hospitalModel = require('../../models/hospital/hospital.model')
// const cors = require('cors');
const express = require('express');
const session = require('express-session');

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

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const doctor = await doctorModel.findOne({ _id: id })
    if (doctor) {
        res.status(200).json(doctor)
    }
    else {
        res.status(404).json({ message: "No data" })
    }
});

router.get('/', async (req, res) => {
    const doctors = await doctorModel.find({})
    if (!doctors) {
        res.status(500).json({ message: "Server error" })
    }
    else {
        res.status(200).json(doctors)
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, age, record, specialization, hospitals, patients, status } = req.body;

        // Update the doctor document
        await doctorModel.findOneAndUpdate(
            { _id: id },
            { name, email, mobile, age, record, specialization, hospitals, patients, status }
        );

        // Update each hospital by adding this doctor to their doctors array
        if (hospitals)
            await hospitalModel.findOneAndUpdate(
                { _id: hospitals },
                { $addToSet: { doctors: id } } // Add the doctor ID without duplicating
            );

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.error("Error updating doctor:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;