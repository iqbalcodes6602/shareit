import { useState, useEffect, useRef } from "react";
import "./App.css";
import { uploadFile, getFiles, validatePassword } from "./service/api";

function App() {
  const [file, setFile] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef();

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await getFiles();
      setFiles(response || []);
    };
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
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setError("");
  };

  const handleDownload = async () => {
    const response = await validatePassword(selectedFile._id, inputPassword);
    if (response && response.success) {
      window.location.href = response.downloadLink;
    } else {
      setError("Incorrect password!");
    }
    setInputPassword("");
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h1>Simple file sharing!</h1>
        <p>Upload and share the download link.</p>

        {/* Upload Form */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={() => fileInputRef.current.click()}>Select File</button>
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleFileUpload}>Upload</button>

        {/* Display Files */}
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <span>{file.name}</span>
              <button onClick={() => handleFileClick(file)}>Download</button>
            </li>
          ))}
        </ul>

        {/* Password Dialog */}
        {selectedFile && (
          <div className="password-dialog">
            <h3>Enter Password</h3>
            <input
              type="password"
              placeholder="Password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <button onClick={handleDownload}>Submit</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
