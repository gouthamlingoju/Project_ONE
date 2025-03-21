import React, { useState } from 'react';

const FileDetailBar = ({ processedFiles }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  
    const handleButtonClick = () => {
      setShowNotification(true);
      
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    if (expandedIndex !== index) {
      // Initialize editedData with the current processed file data when opening the pop-up
      setEditedData({ ...processedFiles[index][0] });
      // console.log(processedFiles)
    }
  };

  const handleClosePopup = () => {
    setExpandedIndex(null);
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Prepare the data as a JSON object
      const formData = {
        ...editedData, // Include all edited data
      };
      console.log(editedData);
      console.log(JSON.stringify(formData));
      // Send the data to the backend
      const response = await fetch('http://localhost:8000/convert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure the backend expects JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data submitted successfully:', data);
        // Optionally, handle success (e.g., show a success message or reset the form)
      } else {
        console.error('Error submitting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative mb-45 mt-20">
      <div className="p-4">
        <p className='text-2xl'>Processed Files</p>
      </div>
      {processedFiles.map((processedFile, index) => (
        <div key={index} className="mb-4">
          {/* Clickable Bar */}
          <div
            className="cursor-pointer bg-gray-200 p-4 rounded-md border border-gray-300"
            onClick={() => handleToggle(index)}
          >
            <h3 className="font-semibold text-lg">Processed File {index + 1}</h3>
          </div>

          {/* Expanded Details - Pop-Up */}
          {expandedIndex === index && (
            <div
              className="fixed inset-0 bg-gray-800 bg-opacity-50 z-[110] flex justify-center items-center backdrop-blur-md"
              onClick={handleClosePopup}
            >
              {/* Pop-up Content */}
              <div
                className="bg-white p-6 rounded-lg w-[90%] h-[90%] overflow-y-auto flex"
                onClick={(e) => e.stopPropagation()} // Prevent click event from closing the popup
              >
                {/* Left side - Image */}
                <div className="flex-shrink-0 w-1/3 mr-4 p-5">
                  {/* Assuming the file is an image, show an image preview */}
                  {processedFile[1].type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(processedFile[1])}
                      alt={`Processed File ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-md">
                      <p>No Image Preview</p>
                    </div>
                  )}
                </div>
                {/* Right side - Editable Data */}
                <div className="flex-grow w-2/3 p-5 overflow-y-auto">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-xl">Processed File {index + 1} Details</h3>
                    <button
                      className="text-red-500 font-semibold"
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>

                  {/* Editable Form */}
                  
                  <form onSubmit={handleSubmit}>
                    {Object.keys(processedFile[0]).map((key) => (
                      <div key={key} className="mb-4 flex items-center">
                        <label className="text-sm font-medium mr-2 w-1/3">
                          {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                        </label>
                        <input
                          type="text"
                          value={editedData[key] || ''}
                          onChange={(e) => handleInputChange(e, key)}
                          className="w-2/3 p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                    

                    <button
                      onClick={handleButtonClick}
                      type="submit"
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" >
                      Save Data
                    </button>
                    {showNotification && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-2 pl-10 pr-10 rounded-md shadow-lg">
                          Data Saved!!
                        </div>
                      )}
                  </form>
                  </div>
                </div>
              </div>
          )}
        </div>
      ))}

      {/* Apply Blur Effect to the Rest of the Content */}
      {expandedIndex !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-[105] backdrop-blur-sm"></div>
      )}
    </div>
  );
};

export default FileDetailBar;
