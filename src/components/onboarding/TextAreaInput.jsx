const TextAreaInput = ({ value, onChange, placeholder, maxLength = 600 }) => {
  return (
    <div className=" w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="
            w-full 
            h-32 
            p-3 
            border 
            border-gray-300 
            rounded-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-primary 
            resize-none
            text-sm
          "
      />
      <p className="text-xs text-gray-500">Max 100 words</p>
    </div>
  );
};

export default TextAreaInput;
