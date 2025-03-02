import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle form submission and file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      // Send files to the backend using axios
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle response from the server
      setResponse(res.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Upload Your Files</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload Files
          </button>
        </form>

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Uploaded Files:</h3>
            <ul className="list-disc pl-6 text-gray-600">
              {response.filenames.map((filename, index) => (
                <li key={index} className="mt-2">{filename}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
