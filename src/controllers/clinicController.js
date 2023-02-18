import clinicService from '../services/clinicService';

let createNewClinic = async (req, res) => {
    try {
        let data = await clinicService.createNewClinic(req.body);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic();
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.id);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

module.exports = { createNewClinic, getAllClinic, getDetailClinicById }