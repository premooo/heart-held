const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            'mongodb+srv://rafaelvalleremo9:d4pA9tSiC1vWRk8u@cluster0.nbysm.mongodb.net/feed?retryWrites=true&w=majority&appName=Cluster0',
            );
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;
