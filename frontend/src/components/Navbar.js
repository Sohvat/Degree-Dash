import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import Logo from "../images/Logo.png";
import ProfilePic from "../images/Logo.png";
import "../styles/Navbar.css";
import {Link} from 'react-router-dom';

function Navbar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="navbar__brand">
                <img src={Logo} alt="Degree Dash Logo" className="navbar__logo"/>
                <div>
                    <h3>Degree Dash</h3>
                    <p>University of Manitoba</p>
                    <p>Department of Computer Science</p>
                </div>
            </Link>

            <div className="navbar__links">
                <Link to="/courses">View all Courses</Link>
                <Link to="/professors">View all Professors</Link>
            </div>

            {user && (
                <div className="profile-container">
                    <img
                        src={ProfilePic}
                        alt="Your Profile"
                        className="profile-pic"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <p>{user?.name}</p>
                            <a href="/account">Account</a>
                            <a href="/settings">Settings</a>
                            <button onClick={handleLogout}>Log out</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;