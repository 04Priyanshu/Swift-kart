import React from 'react';

interface RatingsProps {
  rating: number; // rating from 0 to 5 (can be float)
}

const Ratings: React.FC<RatingsProps> = ({ rating }) => {
  // Clamp rating between 0 and 5
  const safeRating = Math.max(0, Math.min(5, rating));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= safeRating ? '#FFD700' : '#E0E0E0', fontSize: 24 }}>
          {star <= Math.floor(safeRating) ? '★' : (star - safeRating < 1 && safeRating % 1 !== 0 ? '⯨' : '☆')}
        </span>
      ))}
    </div>
  );
};

export default Ratings;