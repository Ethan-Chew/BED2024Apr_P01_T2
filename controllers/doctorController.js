const Doctor = require('../models/doctor');

//HERVIN 
const updateDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).send({ message: 'Doctor ID is required' });
        }

        const { name, email, creationDate } = req.body;
    
        // Update Doctor
        const updateDoctorRes = await Doctor.updateDoctorById(doctorId, name, email, creationDate);

        if (updateDoctorRes) {
            res.status(200).json({
                message: "Doctor Account Updated Successfully",
                updateDoctorRes
                //doctor: await Doctor.getDoctorById(doctorId)
            });
        } else {
            res.status(500).json({
                message: "Failed to Update Doctor Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

//HERVIN
const getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).send({ message: 'Doctor ID is required' });
        }

        const doctor = await Doctor.getDoctorById(doctorId);

        if (!doctor) {
            res.status(404).json({
                message: `Doctor with ID ${doctorId} not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Doctor with ID Found",
            doctor: doctor
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

//HERVIN
const getAllDoctor = async (req, res) => {
    try {
        const doctors = await Doctor.getAllDoctors();

        if (!doctors) {
            res.status(404).json({
                message: `Doctors not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Doctors Found",
            doctors: doctors
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    updateDoctorById,
    getDoctorById,
    getAllDoctor
}