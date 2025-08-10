import logo from "../../assets/images/edupeerhub-logo1.svg";
import { Link } from "react-router-dom";

const AuthIntro = ({ heading, subText, linkText, linkTo }) => (
  <div className="text-center mb-6">
    <img src={logo} alt="Edupeerhub" className="mx-auto mb-4 h-12" />
    <h2 className="text-2xl font-bold">{heading}</h2>
    <p className="text-sm mt-2">
      {subText}{" "}
      <Link to={linkTo} className="text-blue-600 underline">
        {linkText}
      </Link>
    </p>
  </div>
);

export default AuthIntro;
