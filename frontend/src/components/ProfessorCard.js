import { Link } from 'react-router-dom';
import '../styles/ProfessorCard.css';

const ProfessorCard = ({ professor }) => {
  return (
    <Link to={`/professors/${professor._id}`} className="prof-card">
      <div className="prof-card__avatar">
        {professor.name.charAt(0)}
      </div>
      <div className="prof-card__info">
        <h3 className="prof-card__name">{professor.name}</h3>
        <p className="prof-card__dept">{professor.department}</p>
        <p className="prof-card__bio">{professor.bio}</p>
      </div>
    </Link>
  );
};

export default ProfessorCard;