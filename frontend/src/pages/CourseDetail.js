import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { courses, professors, reviews } from "../data/dummyData";
import '../styles/CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const [selectedProfessor, setSelectedProfessor] = useState('all');
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  // find course
  const course = courses.find(c => c._id === id);
  if (!course) return <p>Course not found</p>;

  // get professors for this course
  const courseProfessors = professors.filter(p =>
    course.professors.includes(p._id)
  );

  // filter reviews by course and selected professor
  const filteredReviews = localReviews.filter(r => {
    const matchesCourse = r.courseId === id;
    const matchesProf = selectedProfessor === 'all' || r.professorId === selectedProfessor;
    return matchesCourse && matchesProf;
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      _id: Date.now().toString(),
      courseId: id,
      professorId: selectedProfessor === 'all' ? courseProfessors[0]._id : selectedProfessor,
      text: reviewText,
      rating,
      user: 'You',
    };
    setLocalReviews(prev => [...prev, newReview]);
    setReviewText('');
    setRating(0);
    setPopupOpen(false);
  };

  return (
    <div className="course-detail">
      {/* Course Info */}
      <h1>{course.code} - {course.title}</h1>
      <p>{course.department}</p>
      <p>{course.description}</p>

      {/* Professor Filter */}
      <div className="professor-filter">
        <h2>Filter by Professor</h2>
        <div className="professor-filter__buttons">
          <button
            className={selectedProfessor === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setSelectedProfessor('all')}
          >
            All
          </button>
          {courseProfessors.map(prof => (
            <button
              key={prof._id}
              className={selectedProfessor === prof._id ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedProfessor(prof._id)}
            >
              {prof.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <div className="reviews-section__header">
          <h2>Reviews {selectedProfessor !== 'all' && `for ${professors.find(p => p._id === selectedProfessor)?.name}`}</h2>
          <button className="btn-primary" onClick={() => setPopupOpen(true)}>
            Write a Review
          </button>
        </div>

        {filteredReviews.length === 0 ? (
          <p>No reviews yet — be the first!</p>
        ) : (
          filteredReviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-card__stars">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p>{review.text}</p>
              <small>{review.user} · {professors.find(p => p._id === review.professorId)?.name}</small>
            </div>
          ))
        )}
      </div>

      {/* Review Popup */}
      {popupOpen && (
        <div className="popup" onClick={() => setPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setPopupOpen(false)}>✕</button>
            <h3>Write a Review</h3>

            {/* Professor selector in popup */}
            <select
              value={selectedProfessor === 'all' ? courseProfessors[0]._id : selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
              className="prof-select"
            >
              {courseProfessors.map(prof => (
                <option key={prof._id} value={prof._id}>{prof.name}</option>
              ))}
            </select>

            {/* Star Rating */}
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={star <= (hoverRating || rating) ? 'star filled' : 'star'}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>

            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                rows="4"
                required
              />
              <button type="submit" disabled={rating === 0}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;