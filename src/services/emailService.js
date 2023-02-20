require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (data) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DVH 👻" <dvh31502@gmail.com>', // sender address
        to: data.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(data), // html body
    });
}

let getBodyHTMLEmail = (data) => {
    let result = '';
    if (data.language === 'en') {
        result = `
        <h3>Dear ${data.patientName}!</h3>
        <p>You received this email because you made an online appointment on our website</p>
        <p>
        Information to book a medical appointment
        </p>
        <div>
            <b>Time : ${data.time}</b>
        </div>
        <div>
        <b>Doctor : ${data.doctorName}</b>
        </div>
        <p>
        If the information is correct please click on the link to confirm and complete the booking procedure
        </p>
        <div><a href=${data.redirectLink} target="_blank">Click here</a></div>
        <div>Thank you very much</div>
    `
    }
    if (data.language === 'vi') {
        result = `
        <h3>Xin chào ${data.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch online trên web chúng tôi</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div>
            <b>Thời gian khám : ${data.time}</b>
        </div>
        <div>
        <b>Bác sĩ khám : ${data.doctorName}</b>
        </div>
        <p>Nếu thông tin đúng vui lòng click vào đường link để xác nhận và hoàn tất thủ tục đặt lịch</p>
        <div><a href=${data.redirectLink} target="_blank">Click here</a></div>
        <div>Chân thành cảm ơn</div>
    `
    }
    return result
}

let getBodyHTMLEmailRemedy = (data) => {
    let result = '';
    if (data.language === 'en') {
        result = `
        <h3>Dear ${data.patientName}!</h3>
        <p>You received this email because you made an online appointment on our website</p>
        <p>Prescription/invoice information is sent in the attached file</p>
        <div>Thank you very much</div>
    `
    }
    if (data.language === 'vi') {
        result = `
        <h3>Xin chào ${data.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch online trên web chúng tôi</p>
        <p>Thông tin đơn thuốc/ hóa đơn được gửi theo file đính kèm</p>
        <div>Chân thành cảm ơn</div>
    `
    }
    return result
}

let sendAttachment = async (data) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"DVH 👻" <dvh31502@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(data), // html body
        attachments: [{
            filename: `remedy-${data.patientName}-${new Date().getTime()}.png`,
            content: data.imagebase64.split("base64,")[1],
            encoding: 'base64'
        }]
    });
}

module.exports = { sendSimpleEmail, sendAttachment }