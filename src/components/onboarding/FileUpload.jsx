import { useRef } from "react";

const FileUpload = ({ onChange, accept = ".pdf,.jpg,.jpeg,.png" }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <div
      className="
        flex flex-col items-center justify-center 
        w-full border-2 border-dashed border-gray-300 
        rounded-lg p-6 
        hover:border-indigo-400 
        transition cursor-pointer
      "
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
      <svg
        className="w-12 h-12 text-gray-400 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V4m0 0L3 8m4-4l4 4M13 16h4m-2-2v4m-6 4h12a2 2 0 002-2V8a2 2 0 00-2-2h-6l-2-2H7a2 2 0 00-2 2v4"
        />
      </svg>
      <span className="text-sm text-gray-600">Click to upload</span>
      <span className="text-xs text-gray-400 mt-1">
        PDF, JPG, PNG up to 5MB
      </span>
    </div>
  );
};

export default FileUpload;
