import express from "express"
import mongoose, { connect } from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import cors from "cors"
import productRouter from "./routes/productRouter.js"
import dotenv from "dotenv"

dotenv.config()

const mongoURI = process.env.MONGO_URL

mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB cluster");
    })
    .catch((e) => {
        console.log(e);
    });

const app = express()

app.use(cors())

app.use(express.json())

app.use(
    (req,res,next)=>{
        
        const authorizationheader = req.header("Authorization")

        if(authorizationheader !=null){

            const token = authorizationheader.replace("Bearer ","")



            jwt.verify(token, process.env.JWT_SECRET,
                (error,content)=>{
                    
                    if(content == null){

                        console.log("invalid token")

                        res.status(401).json({
                            message: "Invalid token"
                        })
                    }else{
                    
                    req.user = content
                    
                    next()

                    }
                }
            )
        }else{
            next()
        }
        

    }
)


app.use("/api/users",userRouter)
app.use("/api/products",productRouter)



app.listen(3000, 
    ()=>{
        console.log("server is running")
    }
)
