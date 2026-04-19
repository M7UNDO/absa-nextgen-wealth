import {Link, useLocation} from "react-router-dom";
import "../styles/Breadcrumb.css";

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="breadcrumb-wrapper">
      <div className="breadcrumb-container">
        <span className="breadcrumb-label">You are here:</span>

        <Link to="/" className="breadcrumb-link">
          Home
        </Link>

        {pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          const name = value.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <span key={routeTo} className="breadcrumb-item">
              <span className="breadcrumb-separator">/</span>

              {isLast ? (
                <span className="breadcrumb-current">{name}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {name}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default Breadcrumb;
