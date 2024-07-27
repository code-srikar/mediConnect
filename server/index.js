const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
const db_url = process.env.MONGODB_URL

const app = express()

app.use(cors())

app.use(express.json())

const patientRouter = require('./routes/patientrouters/patientauthentication.router')

const doctorRouter = require('./routes/doctorrouters/doctorauthentication.router')

const hospitalRouter = require('./routes/hospitalrouters/hospitalauthentication.router')

mongoose.connect(db_url)
    .then(console.log("Mongo Connected"))
    .catch(err => console.log(err))

//Patient End Points
app.use('/api/patient', patientRouter)

//Doctor End Points
app.use('/api/doctor', doctorRouter)

//Hospital End Points
app.use('/api/hospital', hospitalRouter)

app.listen(port, () => console.log(`Server is running on ${port}`))