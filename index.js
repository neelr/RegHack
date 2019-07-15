const qrcode = require("qrcode");
const nodemailer = require('nodemailer');
const deasync = require('deasync');
const ip = require('ip');
const express = require("express");
const ejs = require("ejs");
var fs = require('fs');
require('dotenv').config();
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL,(err) => err ? console.log(err) : console.log("Connection to MongoDB Succesful!"));

var People = require("../RegHack/models/People");
const bodyParser = require('body-parser');
const app = express();
app.set('view engine','ejs');
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

app.get("/",(req,res) => {
    res.send("Hi this is RegHack!");
})
app.get("/form", (req,res) => {
    res.render("form");
})
app.post("/addperson", (req,res,next) => {
    //Add your API Key here or make it more secure?
    if ("::1" != req.ip && req.key != process.env.API_KEY) {return next(new Error("Not Authorized"))}
    console.log(req.path);
    console.log(req.body.name);
    var id = mongoose.Types.ObjectId();
    var person = new People({
        "_id": id,
        "name":req.body.name,
        "age":req.body.age,
        "email":req.body.email,
        "checked":false
    });
    person.save()
        .then((result)=> console.log(result))
        .catch((err) => console.log(err));
    res.redirect('/form');
})
app.get("/people",(req,res) => {
    People.find({},(err,result) => {
        res.render("people",{"data":result});
    })
});
app.get("/reader",(req,res) => {
    res.render("reader");
});
app.post("/toggleID",(req,res)=> {
    if ("::1" != req.ip && req.key != process.env.API_KEY) {return next(new Error("Not Authorized"))}
    var id = req.body.id;
    var checked;
    req.body.where == "in" ? checked = true : checked = false;
    People.findByIdAndUpdate(id,{$set: {"checked":checked}},(err,result) => {
        res.json(result);
    })
});
app.post("/mail",(req,res) => {
    if ("::1" != req.ip && req.key != process.env.API_KEY) {return next(new Error("Not Authorized"))}
    console.log(req.body);
    People.find({}, (err,result)=> {
        var done = false;
        var i;
        for (i = 0; i<result.length; i++) {
            done = false;
            qrcode.toDataURL(result[i]._id.toString(), (err,url) => {
                transporter.sendMail({
                    from: '"Neel" <neel.redkar@gmail.com>',
                    to: result[i].email,
                    subject: req.body.subject.replace("()name()",result[i].name).replace("()b64code()",url),
                    html: req.body.html.replace("()name()",result[i].name).replace("()b64code()",url),
                });
                done = true;
            })
            require('deasync').loopWhile(function(){return !done;});
        }
        res.json({"complete":true})
    });
});
app.listen(3000, (err) => {
    console.log("RegHack is on and ready to go on port 3000!");
})