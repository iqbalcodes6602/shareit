import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    path: { type: String, required: true },
    name: { type: String, required: true },
    downloadCount: { type: Number, required: true, default: 0 },
    password: { type: String, required: true }, // Add password field
});

const File = mongoose.model('file', FileSchema);

export default File;