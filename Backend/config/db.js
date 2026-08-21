const mongoose = require('mongoose');
const dns = require('dns');

// Pehle yeh line HAMESHA (hardcoded) chalti thi — poore Node
// process ki DNS resolution ko force Google DNS (8.8.8.8/8.8.4.4)
// par bhej deti thi. Isse sirf MongoDB Atlas ka SRV lookup theek
// hota tha, lekin Cloudinary/Razorpay/Twilio/Shiprocket jaisi
// baaki saari services ki DNS bhi isi se resolve hoti thi — jo
// kisi doosre network/ISP par ulta problem create kar sakta tha
// (isliye "backend properly kaam nahi karna" ka ek possible reason).
//
// Ab yeh sirf opt-in hai — sirf tab lagega jab .env mein
// USE_GOOGLE_DNS=true set ho (jaise agar tumhare ISP/router
// par mongodb+srv:// resolve nahi ho raha ho).
if (process.env.USE_GOOGLE_DNS === 'true') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;