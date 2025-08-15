const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error p-2 w-full max-w-lg mx-auto my-1">
      <ul className="list-none pl-0 list-inside text-sm">
        <li>{message}</li>
      </ul>
    </div>
  );
};

export default ErrorAlert;
