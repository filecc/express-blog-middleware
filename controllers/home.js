const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */

function index (req, res) {
    let html = fs.readFileSync(path.resolve("./views/index.html"), "utf8");
    if(req.cookies.user){
        html = html.replace('{menuItem1}', '') 
        html = html.replace('{menuItem2}', '<a href="/admin">Dashboard</a>')
        html = html.replace('{menuItem3}', '<a href="/logout">Logout</a>')
    } else {
        html = html.replace('{menuItem1}', '<a href="/login">Login</a>')
        html = html.replace('{menuItem2}', '')
        html = html.replace('{menuItem3}', '')
    }
    
    res.send(html);
   
}

module.exports = {
    index
  }