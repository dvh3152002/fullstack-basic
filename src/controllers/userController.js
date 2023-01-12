import userService from "../services/userServices"

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //check exist email
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input parameter"
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    //compare password
    //return userInfor
    //access_token: JWT json web token
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id;//ALL,id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: ''
        })
    }
    let users = await userService.getAllUser(id);
    console.log(users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log("get all code: ", error);
        return res.status(200).json({
            errCode: -1,
            errorMessage: "Error from server"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode
}