// import dns from "node:dns"
// dns.setServers(["8.8.8.8", "1.1.1.1"])

import dotenv from "dotenv"

import express from "express"
import DbConnection from "./db/index.js"

dotenv.config({
    path: "./.env"
})

const app = express()

DbConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log()
    })
})
.catch((error)=>{
    
})