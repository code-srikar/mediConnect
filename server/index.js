const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');

const port = process.env.PORT || 5000;
const db_url = process.env.MONGODB_URL;

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

const patientAuthenticationRouter = require('./routes/patientrouters/patientauthentication.router');
const patientProfileRouter = require('./routes/patientrouters/patientprofile.router');
const doctorsRouter = require('./routes/doctorrouters/doctorprofile.router');
// const paymentRouter = require('./routes/patientrouters/payment.router');

const doctorAuthenticationRouter = require('./routes/doctorrouters/doctorauthentication.router');
const doctorProfileRouter = require('./routes/doctorrouters/doctorprofile.router');

const hospitalAuthenticationRouter = require('./routes/hospitalrouters/hospitalauthentication.router');
const hospitalsRouter = require('./routes/hospitalrouters/hospitalprofile.router');

const appointmentRouter = require('./routes/appointmentrouters/appointment.router');
const review = require('./controllers/reviews');
const medication = require('./controllers/medications.controllers')
const message = require('./controllers/message.contoller')
const prescriptionRouter = require('./routes/prescriptionroutes/prescription.router')

mongoose.connect(db_url, {
    tls: true,
})
    .then(() => console.log("Mongo Connected"))
    .catch(err => console.log(err));


// Patient End Points
app.use('/api/patient', patientAuthenticationRouter);
app.use('/api/patient/profile', patientProfileRouter);
app.use('/api/patient/doctorslist', doctorsRouter);
app.use('/api/patient/hospitals', hospitalsRouter);
// app.use('/api/patient/appointment', paymentRouter);

// Doctor End Points
app.use('/api/doctor', doctorAuthenticationRouter);
app.use('/api/doctor/profile', doctorProfileRouter);
app.use('/api/doctor/hospitals', hospitalsRouter);

// Hospital End Points
app.use('/api/hospital', hospitalAuthenticationRouter);
app.use('/api/hospitals', hospitalsRouter);

//Appointment End Ponints
app.use('/api/patient', review)
app.use('/api/appointment', appointmentRouter);
app.use('/api', medication);
app.use('/api', message);

//Prescription End Points
app.use('/api/prescriptions', prescriptionRouter)

app.listen(port, () => console.log(`Server is running on ${port}`));
