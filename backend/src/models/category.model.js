
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    }
}, {timestamps: true});

export const Category = mongoose.model('Category', categorySchema);