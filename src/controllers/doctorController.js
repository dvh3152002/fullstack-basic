import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (limit) limit = 10;
    try {
        let data = await doctorService.getTopDoctorHome(limit);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ..."
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let saveInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctorService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getDetailsDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getDetailsDoctorService(req.query.id);
        return res.status(200).json(infor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getDateSchedule = async (req, res) => {
    try {
        let data = await doctorService.getDateSchedule(req.query.doctorId, req.query.date);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getExtraDoctorInfor = async (req, res) => {
    try {
        let data = await doctorService.getExtraDoctorInfor(req.query.id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getProfileDoctor = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctor(req.query.id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getListPatientForDoctor = async (req, res) => {
    try {
        let data = await doctorService.getListPatientForDoctor(req.query.id, req.query.date);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInforDoctor: saveInforDoctor,
    getDetailsDoctor: getDetailsDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getDateSchedule: getDateSchedule,
    getExtraDoctorInfor: getExtraDoctorInfor,
    getProfileDoctor: getProfileDoctor,
    getListPatientForDoctor: getListPatientForDoctor
}