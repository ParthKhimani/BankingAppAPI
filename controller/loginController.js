const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.signIn = (req, res, next) => {
    const { userName, password } = req.body;
    User.findOne({ $and: [{ userName: userName }, { password: password }] })
        .then(result => {
            if (result != null) {
                const token = jwt.sign(
                    { userName: result.userName },
                    "thisIsSecrect",
                    { expiresIn: '1d' }
                );
                res.status(200).json({ message: 'logged in successfully!', token: token, user: result });
            }
            else {
                res.status(404).json({ message: 'invalid credentials' });
            }
        })
}

var otpMailed = String(Math.floor((Math.random() * 1000000) + 1));
console.log(otpMailed);

exports.identification = async (req, res, next) => {
    const { accountType, contactNumber, emailId } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const user = new User({
            accountType: accountType,
            contactNumber: contactNumber,
            emailId: emailId
        })
        await user.save()
        res.status(200).json({ message: 'data added sucessfully!' });
        req.session.mailId = emailId;

        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '<emailId>',
                pass: '<appKey>'
            }
        });

        let mailDetails = {
            from: '<emailId>',
            to: emailId,
            subject: 'OTP for verification',
            text: 'Your verification code is: ' + otpMailed
        };

        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
    }
    else {
        res.status(422).json({ message: errors.array()[0].msg });
    }
}

exports.verification = (req, res, next) => {
    const { otpEntered } = req.body;
    var otpCheck = otpMailed.localeCompare(otpEntered);
    if (otpCheck != 0) {
        res.status(400).json({ message: "otp doesn't matched" });
    }
    else {
        const { imageData1 } = req.file;
        var imageUrl1 = imageData1.path;
        User.findOneAndUpdate({ emailId: req.session.mailId }, {
            imagePath1: imageUrl1,
        })
        res.status(200).json({ message: 'data added sucessfully!' });
    }
}

exports.verificationSelfieUpload = (req, res, next) => {
    const { imageData2 } = req.file;
    var imageUrl2 = imageData2.path;
    User.findOneAndUpdate({ emailId: req.session.mailId }, {
        imagePath2: imageUrl2,
    })
    res.status(200).json({ message: 'data added sucessfully!' });
}

exports.creation = (req, res, next) => {
    const { title, firstName, lastName, gender, dateOfBirth, address1, address2, country, state, city, pin } = req.body;
    User.findOneAndUpdate({ emailId: req.session.mailId }, {
        title: title,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        address1: address1,
        address2: address2,
        country: country,
        state: state,
        city: city,
        pin: pin
    })
    res.status(200).json({ message: 'data added sucessfully!' });
}

exports.success = (req, res, next) => {
    const { userId, password, confirmPassword, wpAlert, emailAlert } = req.body;
    User.findOneAndUpdate({ emailId: req.session.mailId }, {
        userName: userId,
        password: password,
        confirmPassword: confirmPassword,
        wpAlert: wpAlert,
        emailAlert: emailAlert
    })
    res.status(200).json({ message: 'data added sucessfully!' });
}