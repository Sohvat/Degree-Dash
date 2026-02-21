import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses, professors } from "../data/dummyData";
import CourseCard from "../components/CourseCard";
import ProfessorCard from "../components/ProfessorCard";
import '../styles/Home.css';

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfessors = professors.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <input
        type="text"
        placeholder="Search courses or professors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Courses */}
      <section>
        <div className="section-header">
          <h2>Courses</h2>
          <button className="see-all-btn" onClick={() => navigate('/courses')}>
            See all →
          </button>
        </div>
        {filteredCourses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <div className="courses-container">
            {filteredCourses.slice(0, 4).map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Professors */}
      <section>
        <div className="section-header">
          <h2>Professors</h2>
          <button className="see-all-btn" onClick={() => navigate('/professors')}>
            See all →
          </button>
        </div>
        {filteredProfessors.length === 0 ? (
          <p>No professors found</p>
        ) : (
          <div className="professors-container">
            {filteredProfessors.slice(0, 4).map(prof => (
              <ProfessorCard key={prof._id} professor={prof} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;