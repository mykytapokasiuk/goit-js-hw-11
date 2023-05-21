import REFS from './js/references.js';
import FUNC from './js/functions.js';

REFS.form_element.addEventListener('submit', FUNC.onSubmit);
REFS.loadmore_btn.addEventListener('click', FUNC.fetchHits);
