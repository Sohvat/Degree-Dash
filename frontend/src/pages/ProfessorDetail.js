import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Professor() {
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get(`/professors/${id}`);
        setProfessor(response.data.professor);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    // TODO: call your review API here
    console.log("Review submitted:", reviewText);
    setReviewText("");
    setPopupOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!professor) return <p>Professor not found</p>;

  return (
    <div>
      <h1>{professor.name}</h1>
      <p>Department: {professor.department}</p>
      <p>{professor.bio}</p>

      <button onClick={() => setPopupOpen(true)}>Write a Review</button>

      {popupOpen && (
        <div className="popup" onClick={() => setPopupOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setPopupOpen(false)}>✕</span>
            <h3>Write a Prof Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                rows="4"
                required
              />
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Professor;