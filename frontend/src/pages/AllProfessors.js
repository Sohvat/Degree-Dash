import React, { useState } from "react";
import { professors } from "../data/dummyData";
import ProfessorCard from "../components/ProfessorCard";
import '../styles/Home.css';

function AllProfessors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const departments = [...new Set(professors.map(p => p.department))];

  const filtered = professors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || prof.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="home-page">
      <h1 className="page-title">All Professors</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search professors..."
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

      <p className="results-count">{filtered.length} professors found</p>

      {filtered.length === 0 ? (
        <p>No professors found</p>
      ) : (
        <div className="professors-container">
          {filtered.map(prof => (
            <ProfessorCard key={prof._id} professor={prof} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProfessors;