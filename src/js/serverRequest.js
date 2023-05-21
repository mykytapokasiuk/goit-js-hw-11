import axios from 'axios';
import VARS from './variables.js';
const URL = 'https://pixabay.com/api/';

/**
 *  Gets array of objects from server
 * @function getImages
 * @param {string} searchQuery
 * @returns {Promise} Promise
 */
const getImages = async () => {
  const response = await axios.get(
    `${URL}?key=36587014-7f3f795310e69f6b2134ce178&q=${VARS.search_query}
      &image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${VARS.page}`
  );
  return response.data;
};

export { getImages };
