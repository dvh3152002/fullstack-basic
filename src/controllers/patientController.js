import patientService from "../services/patientService"

let postBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookAppointment(req.body);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postVerifyBookAppointment(req.body);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

module.exports = { postBookAppointment, postVerifyBookAppointment }