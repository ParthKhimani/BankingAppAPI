const express = require('express');
const { body, check } = require('express-validator');
const loginController = require('../controller/loginController');

const router = express();

router.post('/signin', [
    body('userName').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], loginController.signIn);

router.post('/identification', [
    body('contactNumber')
        .notEmpty().withMessage('Contact number is required')
        .isMobilePhone().withMessage('Contact number must be a valid mobile number'),
    body('emailId')
        .notEmpty().withMessage('Email address is required')
        .isEmail().withMessage('Email address must be a valid email'),
    body('accountType').notEmpty().withMessage('Account type is required')
], loginController.identification);

router.post('/verification', [
    body('imagePath1').notEmpty().withMessage('Image path is required'),
], loginController.verification);

router.post('/verificationSelfieUpload', [
    body('imagePath2').notEmpty().withMessage('Image path is required')
], loginController.verificationSelfieUpload);

router.post('/creation', [
    body('title').notEmpty().withMessage('Title is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('dateOfBirth').notEmpty().withMessage('Date of birth is required'),
    body('address1').notEmpty().withMessage('Address line 1 is required'),
    body('address2').notEmpty().withMessage('Address line 1 is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('pin')
        .notEmpty().withMessage('PIN code is required')
        .isPostalCode('IN').withMessage('PIN code must be a valid postal code')
], loginController.creation);

router.post('/success', [
    body('userId').notEmpty().withMessage('User Id is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('confirmPassword').notEmpty().withMessage('Confirm Password is required'),
    body('wpAlert').notEmpty().withMessage('WhatsApp alert is required'),
    body('emailAlert').notEmpty().withMessage('Email alert is required'),
], loginController.success)

module.exports = router;