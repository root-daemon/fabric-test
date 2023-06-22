import React from 'react';

const FileInput = () => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Process the selected file
    console.log(file);
  };

  return (
    <div>
      <label htmlFor="file-upload" className="custom-file-upload">
        Choose a file
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileInput;
