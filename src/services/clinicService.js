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

module.exports = { createNewClinic }