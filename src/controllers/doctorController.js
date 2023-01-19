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

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}