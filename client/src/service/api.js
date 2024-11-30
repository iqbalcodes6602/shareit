import axios from 'axios';

const API_URI = process.env.REACT_APP_API_URI;

export const uploadFile = async (data, onProgress) => {
  try {
    const response = await axios.post(`${API_URI}/upload`, data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted); // Call the progress callback
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling the API", error.message);
  }
};


export const getFiles = async () => {
    try {
      const response = await axios.get(`${API_URI}/files`);
      return response.data;
    } catch (error) {
      console.log("Error while fetching files:", error.message);
    }
  };
  
  export const validatePassword = async (fileId, password) => {
    try {
      const response = await axios.post(`${API_URI}/validate-password/${fileId}`, { password });
      return response.data;
    } catch (error) {
      console.log("Error while validating password:", error.message);
    }
  };
  