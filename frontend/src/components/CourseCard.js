import { Link } from 'react-router-dom';
import '../styles/CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course._id}`} className="course-card">
      <span className="course-card__code">{course.code}</span>
      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__dept">{course.department}</p>
      <p className="course-card__desc">{course.description}</p>
    </Link>
  );
};

export default CourseCard;