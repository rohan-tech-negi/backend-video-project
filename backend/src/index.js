// import dns from "node:dns"
// dns.setServers(["8.8.8.8", "1.1.1.1"])

import dotenv from "dotenv"
import express from "express"
import DbConnection from "./db/index.js"
import { app } from "./app.js"
dotenv.config({
    path: "./.env"
})

DbConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log()
        console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    })
})
.catch((error)=>{
    
    console.log("MONGO db connection failed !!! ", error);
})