import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(password, salt);
            resolve(hash)
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId', 'firstName', 'lastName', 'id'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    //compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`
                }

                //user already exist
                //compare password
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Please try other email`
            }
            resolve(userData);
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: email
                }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used"
                })
            } else {
                let hashPassword = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                });
            }

            await db.User.destroy({
                where: { id: userId }
            });
            resolve({
                errCode: 0,
                message: `The user is deleted`
            })
        } catch (error) {
            reject(error)
        }
    })
}

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                if (data.avatar) {
                    user.image = data.avatar
                }

                await user.save();
                resolve({
                    errCode: 0,
                    message: "Update successful"
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User isn't found`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: "1",
                    errMessage: "Missing require parameters"
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: type }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService
}