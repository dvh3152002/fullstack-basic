import db from "../models";

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.contentHTML || !data.name || !data.imagebase64 || !data.contentMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                let newClinic = await db.Clinic.create({
                    name: data.name,
                    image: data.imagebase64,
                    address: data.address
                });
                await db.Markdown.create({
                    contentMarkdown: data.contentMarkdown,
                    contentHTML: data.contentHTML,
                    clinicId: newClinic.id
                })
                resolve({
                    errCode: 0,
                    message: 'ok'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: data
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {
                let data = {}
                data = await db.Clinic.findOne({
                    where: { id: id },
                    include: [
                        { model: db.Markdown, attributes: ['contentHTML', 'contentMarkdown'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (data) {
                    if (data.image) {
                        data.image = new Buffer.from(data.image, 'base64').toString('binary');
                    }
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: id,
                        },
                        attributes: ['doctorId']
                    })
                    data.doctorClinic = doctorClinic;
                } else {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { createNewClinic, getAllClinic, getDetailClinicById }