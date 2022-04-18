// console.log("chq chq chq !!")

require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const Fruggies = require("./dbHelpers");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({origin:'*'}));

// IMPORT ROUTERS
const usersRouter = require("./routes/user-route");
const contentsRouter = require("./routes/content-route");

// USER ROUTERS
app.use("/",usersRouter);
app.use("/",contentsRouter);

app.get("/",(req,res)=>{
    res.status(200).json({message:"The SERVER is listening."})
})

// PORT Listening
app.listen(port,()=>{
    console.log(`PORT Listening on port http://localhost:${port}`)
})