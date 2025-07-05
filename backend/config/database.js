const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

// Suppress strictQuery deprecation warning
mongoose.set('strictQuery', true);

const connectDatabase = () => {
    if (!MONGO_URI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("MongoDB Connected Successfully");
        })
        .catch((error) => {
            console.error(`MongoDB Connection Error: ${error.message}`);
            // Let the unhandledRejection handler in server.js handle the process exit
            throw error;
        });
}

module.exports = connectDatabase;