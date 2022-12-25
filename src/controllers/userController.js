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
        userData: userData.user ? userData.user : {}
    })
}

module.exports = {
    handleLogin: handleLogin
}