var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var methodOverride = require("method-override");
var app = express();

//DB setting
mongoose.connect(); // 1
var db = mongoose.connection; // 2
// 3﻿
db.once("open", function(){
 console.log("DB connected");
});
// 4
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//DB Schema
var contactSchema = mongoose.Schema({
 name:{type:String, required:true, unique:true},
 email:{type:String},
 phone:{type:String}
});
var Contact = mongoose.model("contact", contactSchema);
// Routes
// Home // 6
app.get("/", function(req, res){
 res.redirect("/contacts");
});
// Contacts - Index // 7
app.get("/contacts", function(req, res){
 Contact.find({}, function(err, contacts){
  if(err) return res.json(err);
  res.render("contacts/index", {contacts:contacts});
});
});
// Contacts - New // 8
app.get("/contacts/new", function(req, res){
 res.render("contacts/new");
});
// Contacts - create // 9
app.post("/contacts", function(req, res){
 Contact.create(req.body, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts");
 });
});
// Contacts - show // 3
app.get("/contacts/:id", function(req, res){
 Contact.findOne({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.render("contacts/show", {contact:contact});
 });
});
// Contacts - edit // 4
app.get("/contacts/:id/edit", function(req, res){
 Contact.findOne({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.render("contacts/edit", {contact:contact});
 });
});
// Contacts - update // 5
app.put("/contacts/:id", function(req, res){
 Contact.findOneAndUpdate({_id:req.params.id}, req.body, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts/"+req.params.id);
 });
});
// Contacts - destroy // 6
app.delete("/contacts/:id", function(req, res){
 Contact.remove({_id:req.params.id}, function(err, contact){
  if(err) return res.json(err);
  res.redirect("/contacts");
 });
});

// Port setting
app.listen(3000, function(){
 console.log("server on!");
});
