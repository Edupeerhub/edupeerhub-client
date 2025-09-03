import logo from "../../assets/images/edupeerhub-logo1.svg";
import { Link } from "react-router-dom";

const AuthIntro = ({ heading, subText, linkText, linkTo }) => (
  <div className="text-center">
    <img src={logo} alt="Edupeerhub" className="mx-auto mb-1 h-11" />
    <h2 className="text-xl font-bold">{heading}</h2>
    <p className="text-sm mt-1 text-gray-400">
      {subText}{" "}
      <Link to={linkTo} className="text-blue-600 underline font-semibold">
        {linkText}
      </Link>
    </p>
  </div>
);

export default AuthIntro;
