import dotenv from "dotenv"

import express from "Express"
import DbConnection from "./db/index.js"

dotenv.config({
    path: "./env"
})

const app = express()


DbConnection()