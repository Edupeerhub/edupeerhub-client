import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-white text-blue-600 hover:bg-gray-300 focus:ring-blue-500 border-2 border-blue-600",
    outline:
      "bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 focus:ring-white",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-400 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
