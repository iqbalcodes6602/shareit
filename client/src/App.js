import { useState, useEffect, useRef } from "react";
import "./App.css";
import { uploadFile, getFiles, validatePassword } from "./service/api";

const API_URI = process.env.REACT_APP_API_URI;

function App() {
  const [file, setFile] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef();

  const fetchFiles = async () => {
    const response = await getFiles();
    setFiles(response || []);
  };
  
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }

    const data = new FormData();
    data.append("name", file.name);
    data.append("file", file);
    data.append("password", password);

    const response = await uploadFile(data);
    if (response) alert("File uploaded successfully!");
    setFile("");
    setPassword("");
    fetchFiles();
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setError("");
    setIsModalOpen(true); // Open modal on file click
  };

  const handleDownload = async () => {
    const response = await validatePassword(selectedFile._id, inputPassword);
    if (response && response.success) {
      // window.location.href = response.downloadLink;
      console.log("Download link: ", response.encryptedFileName);
      window.location.href = `${API_URI}/file/${response.encryptedFileName}`;
    } else {
      setError("Incorrect password!");
    }
    setInputPassword("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setError("");
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h1 style={{marginBottom: '0px'}}>ShareIt</h1>
        <h1>Simple File Sharing</h1>
        <p>Upload and share the download link securely with a password.</p>

        {/* Upload Form */}
        <div className="upload-form">
          <div style={{display: 'flex'}}>
            <input
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button className="select-file-btn" onClick={() => fileInputRef.current.click()} style={{marginLeft: '10px'}}>
              Select File
            </button>
          </div>
          <button className="upload-btn" onClick={handleFileUpload}>
            Upload
          </button>
        </div>

        {/* Display Files */}
        <ul className="file-list">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              <span className="file-name">{file.name}</span>
              <button className="download-btn" onClick={() => handleFileClick(file)}>
                Download
              </button>
            </li>
          ))}
        </ul>

        {/* Modal for Password Entry */}
        {isModalOpen && selectedFile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{marginBottom: '10px'}}>Enter Password for {selectedFile.name}</h3>
              <input
                type="password"
                placeholder="Password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="password-input"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <button className="close-btn" onClick={closeModal}>
                  Close
                </button>
                {error && <p className="error-message">{error}</p>}
                <button className="submit-btn" onClick={handleDownload}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
