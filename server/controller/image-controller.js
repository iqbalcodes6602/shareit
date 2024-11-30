import File from '../models/file.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const uploadImage = async (request, response) => {
    console.log(request.body);
    const { password } = request.body;
    const fileObj = {
      path: request.file.path,
      name: request.file.originalname,
      password: await bcrypt.hash(password, 10), // Hash the password
    };
  
    try {
      const file = await File.create(fileObj);
      response.status(200).json({ path: `http://localhost:${process.env.PORT}/file/${file._id}` });
    } catch (error) {
      console.error(error.message);
      response.status(500).json({ error: error.message });
    }
  };

  export const validateFilePassword = async (request, response) => {
    const { password } = request.body;
  
    try {
      const file = await File.findById(request.params.fileId);
  
      const isMatch = await bcrypt.compare(password, file.password);
      if (!isMatch) return response.status(401).json({ success: false, message: "Invalid password" });
  
      response.status(200).json({ success: true, encryptedFileName: file.path.split('/')[1] });
    } catch (error) {
      console.error(error.message);
      response.status(500).json({ error: error.message });
    }
  };
  

  export const getImage = async (request, response) => {
    try {
        // Use findOne to get a single document
        const file = await File.findOne({ path: 'uploads/' + request.params.encryptedFileName });
        console.log(file);
        
        if (!file) {
            return response.status(404).json({ msg: 'File not found' });
        }

        file.downloadCount++;
      
        await file.save();
        
        response.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}
