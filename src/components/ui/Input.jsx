const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div className="mb-4">
    {label && <label className="block mb-1 font-medium">{label}</label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border input input-bordered rounded"
    />
  </div>
);

export default Input;
