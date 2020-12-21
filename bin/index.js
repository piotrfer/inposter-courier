const express = require('express');
const path = require("path");
const axios = require("axios");
const bodyParser = require('body-parser');
var app = express();
var serverUrl = "https://inposter-service.herokuapp.com";
var user_token = ''

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render("index");
});

app.get('/login', function(req, res) {
    res.render("login");
});

app.post('/login', function(req, res) {
    axios.post(serverUrl+"/courier/login", {
        'login' : req.body.login,
        'password' : req.body.password
    })
    .then(response => {
        if(response.status == 200){
            user_token = 'Bearer ' + response.data.token
        }
        res.redirect('/dashboard')
    })
    .catch(error => {
        console.log(error)
        res.send('It is not working, sorry :(')
    })
});

app.get('/register', function(req, res) {
    res.render("register");
});

app.post('/register', function(req, res) {
    axios.post(serverUrl+"/courier/signup", {
        'firstname' : req.body.firstname,
        'lastname' : req.body.lastname,
        'email' : req.body.email,
        'login' : req.body.login,
        'password' : req.body.password,
        'licence': req.body.licence
    })
    .then(response => {
         if(response.status == 201) {
             console.log("Registered")
             res.redirect('/login');
         }
    })
    .catch(error => {
        console.log(error)
        res.send('It is not working, sorry :(')
    })
});

app.get('/dashboard', function(req, res) {
    labels = {}
    parcels = {}
    axios.get(serverUrl+"/labels/list", {headers : {'Authorization' : user_token}})
    .then(response => {
        labels = response.data._embedded.items
        console.log(response.data._embedded.items)
        axios.get(serverUrl+"/parcels/list", {headers : {'Authorization' : user_token} })
        .then(response => {
            parcels = response.data._embedded.items
            console.log(response.data._embedded.items)
            res.render("dashboard", labels=labels, parcels=parcels)
        })
        .catch(error => {
            console.log(error)
            res.send('It is not working, sorry :(')
    })
    })
    .catch(error => {
        console.log(error)
        res.send('It is not working, sorry :(')
    })
});

app.listen(3000, function() {
    console.log('App listening on port 3000');
});