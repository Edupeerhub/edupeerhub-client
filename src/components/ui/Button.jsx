const Button = ({ type = "button", onClick, children, className = "" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 mt-5 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600 w-full ${className}`}
  >
    {children}
  </button>
);

export default Button;
