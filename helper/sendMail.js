const nodemailer= require('nodemailer');
const crd= require('../Config/credentials');

exports.sendGreetMail=async (email) => {

    const mail = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: crd.user1 , pass: crd.pass1 },
    })
    mail.sendMail({
        from: 'akshi1233.be22@chitkara.edu.in',
        to: [email],
        subject: `Here is your requested book: ${bookTitle}`,
        text: `Dear User,\n\nPlease find attached the book "${bookTitle}".\n\nBest regards,\nYour Team`,
        attachments: [
            {
            filename: `${bookTitle}.pdf`,
            path: bookFile, // The path to the file on your server
            },
        ],
    }, (err) => {
        if (err) throw err;
        console.log(`Invoice Mail sent to ${email}`)
        return true
    })
    return true
}

