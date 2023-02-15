import specialtyService from '../services/specialtyService';

let createNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createNewSpecialtyService(req.body);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty();
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(200).json({
            errCode: -1,
            errMessage: "Error from the server"
        })
    }
}

module.exports = { createNewSpecialty, getAllSpecialty }