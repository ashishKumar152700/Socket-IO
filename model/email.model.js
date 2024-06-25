import mongoose from "mongoose";
const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
