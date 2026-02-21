import React, { useState } from "react";
import { courses } from "../data/dummyData";
import CourseCard from "../components/CourseCard";
import '../styles/Home.css';

function AllCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const departments = [...new Set(courses.map(c => c.department))];

  const filtered = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || course.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="home-page">
      <h1 className="page-title">All Courses</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="dept-filter"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <p className="results-count">{filtered.length} courses found</p>

      {filtered.length === 0 ? (
        <p>No courses found</p>
      ) : (
        <div className="courses-container">
          {filtered.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllCourses;