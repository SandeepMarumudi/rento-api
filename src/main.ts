import {app} from "./app.js";
import { getTestConnectionName } from "./services/database.service.js";

const start=async()=>{
    try{
        const testConnectionName = await getTestConnectionName();
        console.log(testConnectionName);
        await app.listen({port:3000,host:"0.0.0.0"})
        console.log("Server is running on port 3000");
    }catch(err){
        app.log.error(err);
        process.exit(1);
    }
}

start();
