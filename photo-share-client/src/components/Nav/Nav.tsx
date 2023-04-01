import { Link, useNavigate } from "react-router-dom";
import NavProps from "./Nav.props";

function Nav({ menu }: NavProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("_id");
    localStorage.removeItem("_myEmail");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link className="logo" to="/photos">
        <h3>PhotoShare</h3>
      </Link>
      <div className="nav__BtnGroup">
        {
          menu.map((el) => (
            <Link key={el.path} style={{ marginRight: "10px" }} to={el.path} >{el.name}</Link>
          ))
        }
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </nav>
  );
};

export default Nav;
