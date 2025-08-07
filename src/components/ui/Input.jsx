const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
);

export default Input;
