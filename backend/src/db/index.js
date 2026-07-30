import mongoose from "mongoose"
import {DB_NAME} from "../constant.js"

const DbConnection = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(connectionInstance.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


export default DbConnection