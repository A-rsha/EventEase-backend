require('dotenv').config();

const express = require('express')
const mongoose=require('mongoose')
const cors = require('cors')
const connectDB=require('./config/db')



const app= express();

app.use(cors());
app.use(express.json());
const authRoutes =require('./routes/authRoutes')
const eventRoutes =require('./routes/eventRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const paymentRoutes =require('./routes/paymentRoutes')

app.use("/api/auth",authRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/bookings",bookingRoutes)
app.use('api/payments',paymentRoutes)

mongoose.connect(
  "mongodb+srv://fathimaarshak08_db_user:cwkQ1aMf78OTYmh9@cluster0.vnhcopk.mongodb.net/EventDB"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Connection Error:", err));
connectDB();

app.listen(4003,()=>{

  const PORT=process.env.PORT ||4003
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})
})