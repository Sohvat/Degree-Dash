// Home.js
import React from "react";
import Logo from "../path/to/Logo.png"; // update with your actual path
import ProfilePic from "../path/to/profile.png"; // update with your actual path

function Home() {
  return (
    <div>
      {/* Upper border */}
      <img src={Logo} alt="Degree Dash Logo" />
      <h3>Degree Dash</h3>
      <p>University of Manitoba</p>
      <p>Department of Computer Science</p>

      <a href="/coursesPage">View all Courses</a>
      <a href="/professors">View all Professors</a>

      {/* Top right profile photo & menu */}
      <div className="profile-container">
        <img
          src={ProfilePic}
          alt="Your Profile"
          className="profile-pic"
          id="profileToggle"
        />

        <div className="dropdown-menu" id="profileDropdown">
          <a href="/account">Account</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Log out</a>
        </div>
      </div>
    </div>
  );
}

export default Home;