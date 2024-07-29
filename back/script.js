const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const authRouter = require('./routes/auth');
const LaboratoireRouter = require('./routes/laboratoire');
const EmployeeRouter = require('./routes/employee');
const ProduitRouter = require('./routes/Produit');
dotenv.config();
/*--------------DATABASE CONNECTION----------------*/
mongoose.connect("mongodb+srv://s3if2003:HBQ30gnsotJzj8Ei@teststage.d1t42mm.mongodb.net/?retryWrites=true&w=majority&appName=testStage").then(() => {
    console.log("Database Connected")
});
/*------------------MIDDLEWARE-------------------*/
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/*------------------ROUTES-------------------*/
app.use("/auth", authRouter);
app.use("/laboratoire", LaboratoireRouter);
app.use("/employee", EmployeeRouter);
app.use("/produit", ProduitRouter);







/*------------------ERROR HANDLING-------------------*/
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Something went wrong" }
    res.status(status).json({ message: err.message })
})
/*--------------ServerStart----------------*/
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});