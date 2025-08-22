import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/scan">扫件</Link>
        </li>
        <li>
          <Link to="/table">列表</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
