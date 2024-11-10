import React, { useState } from "react";
import axios from "axios";

function ExcelUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      setSelectedFile(file);
    } else {
      alert("Please upload a .xlsx or .xls file.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 201) {
        setUploadStatus("success");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center text-gray-500"
        >
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center">
            <img
              src="../images/upload.png"
              alt="Upload Icon"
              className="w-12 mb-2"
            />
            <span className="text-gray-700">
              {selectedFile
                ? selectedFile.name
                : "Upload a .xlsx or .xls file here"}
            </span>
          </div>
        </label>

        {selectedFile && (
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Submit
          </button>
        )}

        {uploadStatus === "success" && (
          <div className="mt-4 text-green-600 text-center font-semibold">
            <p>Thank You!</p>
            <p>File Successfully Uploaded.</p>
            <p>Your records will be processed shortly.</p>
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="mt-4 text-red-600 text-center">
            <p>Failed to upload file. Please try again.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default ExcelUpload;
