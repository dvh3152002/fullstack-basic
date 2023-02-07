import db from "../models";
import _, { reject } from 'lodash';
require('dotenv').config();

const MAX_SCHEDULE_NUMBER = process.env.MAX_SCHEDULE_NUMBER;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                ],
                where: {
                    roleId: 'R2'
                },
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            });
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error);
        }
    })
}

let saveInforDoctorService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action ||
                !data.selectPrice || !data.selectPayment || !data.selectProvince || !data.nameClinic ||
                !data.addressClinic | !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                //upsert Markdown
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId
                    })
                } else {
                    let dataDoctor = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false
                    });
                    dataDoctor.contentHTML = data.contentHTML;
                    dataDoctor.contentMarkdown = data.contentMarkdown;
                    dataDoctor.description = data.description;
                    await dataDoctor.save();
                }

                //upsert Doctor_Infor
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: data.doctorId
                    },
                    raw: false
                })

                if (doctorInfor) {
                    doctorInfor.doctorId = data.doctorId;
                    doctorInfor.priceId = data.selectPrice;
                    doctorInfor.provinceId = data.selectProvince;
                    doctorInfor.paymentId = data.selectPayment;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.note = data.note;
                    await doctorInfor.save();
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectPrice,
                        provinceId: data.selectProvince,
                        paymentId: data.selectPayment,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        note: data.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save infor doctor success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailsDoctorService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueVi', 'valueEn'] },
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] }
                    ],
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule.map(item => {
                        item.maxNumber = MAX_SCHEDULE_NUMBER;
                        return item;
                    })
                }

                //get all existing data
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId, date: data.date
                    },
                    attributes: ['maxNumber', 'timeType', 'date', 'doctorId'],
                    raw: true
                })

                //
                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item;
                    })
                }

                //compare difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date
                })

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    message: "Ok"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDateSchedule = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                date = new Date(date / 1);
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] },
                    ],
                    raw: false,
                    nest: true
                })

                data.map(item => {
                    item.date = item.date.getTime();
                    return item;
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInforDoctorService: saveInforDoctorService,
    getDetailsDoctorService: getDetailsDoctorService,
    bulkCreateSchedule: bulkCreateSchedule,
    getDateSchedule: getDateSchedule,
}