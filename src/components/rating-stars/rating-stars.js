import { compose, withState, withHandlers, withProps } from 'recompose';

import RatingStars from './rating-stars.jsx';

export const onRate = ({ setRating, updateRating }) => rating => {
  setRating(rating);
  updateRating(rating);
};

export default compose(
  withState('rating', 'setRating', 0),
  withProps({
    starCount: 5,
  }),
  withHandlers({
    onRate,
  })
)(RatingStars);
