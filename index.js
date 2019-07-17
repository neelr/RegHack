const qrcode = require("qrcode");
const ejsLint = require('ejs-lint');
const nodemailer = require('nodemailer');
const deasync = require('deasync');
const ip = require('ip');
const express = require("express");
const ejs = require("ejs");
var fs = require('fs');
require('dotenv').config();
var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGO_URL, (err) => err ? console.log(err) : console.log("MongoDB connected Succesfully!"));
var People = require("../RegHack/models/People");
const bodyParser = require('body-parser');
const app = express();
var config = require("./config.js")
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/form", (req, res) => {
    res.render("form",{"data":config});
})
app.get("/email", (req, res) => {
    res.render("email");
});
app.post("/addperson", (req, res, next) => {
    //Add your API Key here or make it more secure?
    var id = mongoose.Types.ObjectId();
    var newperson = req.body;
    if (config.checked) {
        newperson.checked = false;
    }
    var person = new People(newperson);
    person.save()
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    res.redirect('/form');
})
app.get("/people/:key", (req, res, next) => {
    if ("::1" != req.ip && req.params.key != process.env.API_KEY) { return next(new Error("Not Authorized")) }
    People.find({}, (err, result) => {
        res.render("people", { "data": result , "config":config});
    })
});
app.get("/reader", (req, res) => {
    res.render("reader");
});
app.post("/checkin", (req, res, next) => {
    if (!config.checked) {return next(new Error("Check In not enabled in config.js"))}
    if ("::1" != req.ip && req.body.key != process.env.API_KEY) { return next(new Error("Not Authorized")) }
    var id = req.body.id;
    var checked;
    req.body.where == "in" ? checked = true : checked = false;
    People.findByIdAndUpdate(id, { $set: { "checked": checked } }, (err, result) => {
        res.json(result);
    })
});
app.post("/sendmail", (req, res, next) => {
    if (!(config.email)) {return next(new Error("Check In not enabled in config.js"))}
    if ("::1" != req.ip && req.body.key != process.env.API_KEY) { return next(new Error("Not Authorized")) }    
    People.find({}, (err, result) => {
        var done = false;
        var i;
        for (i = 0; i < result.length; i++) {
            done = false;
            qrcode.toDataURL(result[i]._id.toString(), (err, url) => {
                var subject = req.body.subject;
                var html = req.body.html;
                for (g in config) {
                    subject = subject.replace("()"+g+"()",result[i][g])
                    html = html.replace("()"+g+"()",result[i][g])
                }
                transporter.sendMail({
                    from: '"Neel" <neel.redkar@gmail.com>',
                    to: result[i].email,
                    subject: subject.replace("()b64code()", url),
                    html: html.replace("()b64code()", url),
                });
                done = true;
            })
            require('deasync').loopWhile(function () { return !done; });
        }
        res.json({ "complete": true })
    });
});
app.post("/clear", (req, res) => {
    if ("::1" != req.ip && req.body.key != process.env.API_KEY) { return next(new Error("Not Authorized")) }
    People.remove({}, (err) => {
        console.log("Cleared MongoDB Collection!")
        res.json({ "removed": true })
    });
});
app.listen(3000, (err) => {
    console.log("RegHack is on and ready to go on port 3000!");
})
