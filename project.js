require('dotenv').config()

const express = require('express')
const fs = require('fs');
const jwt = require('jsonwebtoken')
const app = express()
const port = 301
const murid = require('./users.json')
const name = murid[0].username
const pass = murid[0].password

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/login',(req,res)=>{
   const muridbody = req.body.username
   const password = req.body.password

   if(muridbody === name && password === pass){
    const accessToken = jwt.sign({data: murid}, process.env.TOKEN)
    res.json({ accessToken: accessToken })
   }
})

function auth(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token,process.env.TOKEN,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/data',auth,(req,res)=>{
    fs.readFile('./teachers.json',(err,data)=>{
        let guru = JSON.parse(data)
        res.json(guru)
    })
})

app.listen(port)