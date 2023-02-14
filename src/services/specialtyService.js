import db from "../models";

let createNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.descriptionHTML || !data.name || !data.imagebase64 || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            } else {
                let newSpecialty = await db.Specialty.create({
                    name: data.name,
                    image: data.imagebase64
                });
                await db.Markdown.create({
                    contentMarkdown: data.descriptionMarkdown,
                    contentHTML: data.descriptionHTML,
                    specialtyId: newSpecialty.id
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

module.exports = { createNewSpecialtyService }