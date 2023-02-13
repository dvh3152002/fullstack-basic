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
        html: `
            <h3>Xin chào ${data.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch online trên web chúng tôi</p>
            <p>Thông tin đặt lịch khám bệnh</p>
            <div>
                <b>Thời gian khám : ${data.time}</b>
            </div>
            <div>
            <b>Bác sĩ khám : ${data.doctorName}</b>
            </div>
            <p>Nếu thông tin đúng <vui lòng click vào đường link để xác nhận và hoàn tất thủ tục đặt lịch/p>
            <div><a href=${data.redirectLink} target="_blank">Click here</a></div>
            <div>Chân thành cảm ơn</div>
        `, // html body
    });
}

module.exports = { sendSimpleEmail }