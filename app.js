const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const Store = require('connect-mongodb-session')(session);

const router = require('./routes/router');

const app = express();
const MONGO_URI = 'mongodb+srv://parth:P%40rth2005@cluster0.eixcpta.mongodb.net/bankingApp?retryWrites=true&w=majority';

const store = new Store({
    uri: MONGO_URI,
    collection: 'sessions'
})

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage }).single('image'));
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    store: store
}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method", "GET,PUT,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})
app.use(bodyParser.json());
app.use(router);

mongoose.connect(MONGO_URI)
    .then(app.listen(3434)) 