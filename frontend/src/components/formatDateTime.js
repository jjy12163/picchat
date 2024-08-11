// utils/formatDateTime.js
import moment from 'moment';

export const formatDateTime = (date) => {
  return moment(date).format('MMMM D, YYYY h:mm:ss a');
};

export default formatDateTime;


