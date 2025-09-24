import express from "express"
import mongoose, { connect } from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"

const mongoURI ="mongodb+srv://admin:1234@cluster0.wqvxbz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose .connect (mongoURI).then(
    ()=>{
        console.log("connected to mongoDB cluster")
    }
)

const app = express()

app.use(express.json())

app.use(
    (req,res,next)=>{
        
        const authorizationheader = req.header("Authorization")

        if(authorizationheader !=null){

            const token = authorizationheader.replace("Bearer ","")

            console.log(token)

            jwt.verify(token, "secretkey96$2025",
                (error,content)=>{
                    
                    if(content == null){

                        console.log("invalid token")

                        res.json({
                            message: "Inalid token"
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


app.use("/users",userRouter)
app.use("/products",productRouter)



app.listen(3000, 
    ()=>{
        console.log("server is running")
    }
)
