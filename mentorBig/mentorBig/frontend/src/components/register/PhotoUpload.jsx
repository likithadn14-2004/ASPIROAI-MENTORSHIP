import React from "react";
import { FaCamera } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";

const PhotoUpload = ({
  previewUrl,
  uploading,
  triggerFileInput,
  fileInputRef,
  handlePhotoUpload,
}) => {
  return (
    <div className="text-center">
      <div
        className="relative inline-block cursor-pointer group"
        onClick={triggerFileInput}
      >
        <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaCamera className="text-gray-500 text-2xl" />
          )}
        </div>
        <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md">
          <FiUploadCloud className="text-xs" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {uploading ? "Uploading..." : "Click to upload your profile photo"}
      </p>
    </div>
  );
};

export default PhotoUpload;
