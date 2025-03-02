import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { IoIosArrowDown } from "react-icons/io";
import './styles.css';
import ChildMenu from './ChildMenu'; 
import YearDropdown from './YearDropdown';
import ProcesedFiles from './ProcesedFiles';

const ImageToExcelConverter = () => {
  const currentYear = new Date().getFullYear();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [processedFiles, setProcessedFiles] = useState([]);

  const handleSelectionStandard = (item) => {
    setSelectedStandard(item);
  };
  
  const handleSelectionBoard = (item) => {
    setSelectedBoard(item);
  }

  const handleSelectionYear = (item) => {
    setSelectedYear(item);  
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);

    // Generate previews for new files
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => [...prev, {
            name: file.name,
            url: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragAndDrop = (event)=>{
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFileSelect({target : {files}})
    setIsDragging(false)
  };

  const handleDragEnter = (event)=>{
    event.preventDefault();
    setIsDragging(true)
  }

  const handleDragLeave = (event)=>{
    event.preventDefault();
    setIsDragging(false);
  }

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);
    setProcessedFiles([]);
    try {
      console.log("Converting....",selectedFiles.length,typeof selectedYear);
      console.log(selectedBoard,selectedStandard)
      const result =[];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('standard', selectedStandard);
        formData.append('board', selectedBoard);
        formData.append('year', selectedYear);
        formData.append('file', file);
        const response = await fetch('http://localhost:8000/extract/', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          const processed_file=[data.AI,file]
          console.log('Data:', data);
          setProcessedFiles(prev => [...prev, processed_file]);
          // console.log("Processed Files:",processedFiles);
        }else{
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setSelectedFiles([]);
        setPreviews([]);
      }
    } catch (error) {
      setError('Failed to convert files. Please try again.');
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:8000/download/',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificates.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setError('Failed to download Excel file. Please try again.');
      console.error('Download failed:', error);
    }
  };
  return (
    <div className='h-screen flex'>
      <div className="w-1/2 p-10">
        <div className="flex flex-row mt-20">
          <YearDropdown onSelect={handleSelectionYear} Name="Select Year" />
          <ChildMenu onSelect={handleSelectionStandard} Name="Select Standard" l={["10th Grade", "Intermediate"]} />
          <ChildMenu onSelect={handleSelectionBoard} Name="Select Board" l={["CBSE", "ICSE", "State Board"]} />
        </div>
        <div className="max-w-4xl mx-auto p-6 mb-8">
          <div className="mb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 transition-transform duration-200 ${isDragging ? "scale-105 shadow-md" : "scale-100"}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragAndDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className=''>
                  <Upload className="w-12 h-12 text-gray-400 m-auto" />
                  <div className=''>
                    <span className="text-gray-600 d-block">Click to upload certificate images or drag and drop</span>
                    <span className="text-gray-500">Supported formats: JPG, PNG</span>
                  </div>
                </div>
              </label>
            </div>
  
            {previews.length > 0 && (
              <div className="mb-6 text-center" onDragOver={(e) => e.preventDefault()} onDrop={handleDragAndDrop}>
                <h2 className="font-semibold mb-4 fs-1">Uploaded Images:</h2>
                <div className="border border-gray-200 rounded p-4 m-4 bg-gray-50 h-auto">
                  <div className="h-auto">
                    <div className="row">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative bg-white m-2 p-2 rounded-lg shadow-sm border border-gray-200 w-25 h-auto">
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="hover:bg-red-100 rounded text-red-500 absolute top-1 right-1"
                          >
                            <X className="w-6 h-6 rounded" />
                          </button>
                          <div className="aspect-w-16 aspect-h-9 m-2">
                            <img
                              src={preview.url}
                              alt={preview.name}
                              className="w-100 object-contain rounded bg-gray-10"
                            />
                          </div>
                          <div className="d-flex items-center justify-content-around">
                            <p className="text-center text-gray-600 truncate max-w-[80%]">
                              {preview.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            <div className="flex flex-row mb-20">
              <button
                onClick={handleConvert}
                disabled={selectedFiles.length === 0 || isConverting || !selectedStandard || !selectedBoard}
                className={`p-2 m-3 basis-1/2 rounded ${selectedFiles.length === 0 || isConverting || !selectedStandard || !selectedBoard
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-black'
                }`}
              >
                {isConverting ? 'Converting...' : 'Convert to Excel'}
              </button>
  
              <button
                onClick={handleDownload}
                className="p-2 m-3 basis-1/2 bg-green-500 text-black rounded hover:bg-green-600"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 p-10 overflow-y-auto h-screen">
        <ProcesedFiles processedFiles={processedFiles} />
      </div>
    </div>
  );  
};

export default ImageToExcelConverter;