const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.signIn = (req, res, next) => {
    const { userName, password } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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
    else {
        res.status(422).json({ message: errors.array()[0].msg });
    }
}

var otpMailed = Math.floor(100000 + Math.random() * 900000).toString();
console.log('otp mailed: ' + otpMailed);

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
                pass: 'appKey'
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
    const { otpEntered, imagePath1 } = req.body;
    var otpCheck = otpMailed.localeCompare(otpEntered);
    if (otpCheck != 0) {
        res.status(400).json({ message: "otp doesn't matched" });
    }
    else {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            User.findOneAndUpdate({ emailId: req.session.mailId }, {
                imagePath1: imagePath1,
            })
            res.status(200).json({ message: 'data added sucessfully!' });
        }
        else {
            res.status(422).json({ message: errors.array()[0].msg });
        }
    }
}

exports.verificationSelfieUpload = (req, res, next) => {
    const { imagePath2 } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        User.findOneAndUpdate({ emailId: req.session.mailId }, {
            imagePath2: imagePath2,
        })
        res.status(200).json({ message: 'data added sucessfully!' });
    }
    else {
        res.status(422).json({ message: errors.array()[0].msg });
    }
}

exports.creation = (req, res, next) => {
    const { title, firstName, lastName, gender, dateOfBirth, address1, address2, country, state, city, pin } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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
    else {
        res.status(422).json({ message: errors.array()[0].msg });
    }
}

exports.success = (req, res, next) => {
    const { userId, password, confirmPassword, wpAlert, emailAlert } = req.body;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        User.findOne({ userName: userId })
            .then(result => {
                console.log(result);
                if (result != null) {
                    res.status(400).json({ message: 'User already registered!' });
                }
                else {
                    User.findOneAndUpdate({ emailId: req.session.mailId }, {
                        userName: userId,
                        password: password,
                        confirmPassword: confirmPassword,
                        wpAlert: wpAlert,
                        emailAlert: emailAlert
                    })
                    res.status(200).json({ message: 'data added sucessfully!' });
                }
            })
    }
    else {
        res.status(422).json({ message: errors.array()[0].msg });
    }
}

exports.quickTransfer = (req, res, next) => {
    const { payFrom, payTo, remarks } = req.body;
    if (payFrom == payTo) {
        res.status(400).json({ message: 'Please select another account!' });
    }
    else {
        const { amount } = req.body;
        User.findOne({ emailId: req.session.mailId })
            .then(result => {
                let accounts = [result.accounts.account1, result.accounts.account2, result.accounts.account3, result.accounts.account4, result.accounts.account5];
                let result1;
                let result2;
                let account = "account"
                var accountFrom;
                var accountTo;
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i]["accountNumber"] == `${payFrom}`) {
                        result1 = accounts[i];
                        number = (i + 1).toString();
                        accountFrom = account.concat(number)
                        break;
                    }
                }
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i]["accountNumber"] == `${payTo}`) {
                        result2 = accounts[i];
                        number = (i + 1).toString();
                        accountTo = account.concat(number);
                        break;
                    }
                }
                var remainingAmount = result1.balance - amount;
                var amountAfterBalanceAdded = result2.balance + amount;
                var balance = `accounts.${accountFrom}.balance`;
                var balance2 = `accounts.${accountTo}.balance`;
                User.findOneAndUpdate({ emailId: req.session.mailId },
                    {
                        [balance]: remainingAmount,
                        [balance2]: amountAfterBalanceAdded,
                        remarks: remarks
                    }
                )
                    .then(res.status(200).json({ message: 'Money transfer successful!', remainingAmount: remainingAmount, amountAfterBalanceAdded: amountAfterBalanceAdded }))
            })
    }
}