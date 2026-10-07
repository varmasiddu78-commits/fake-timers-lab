// Calls fn only after `wait` ms have passed with no new calls.
// Typical use: search-as-you-type, so the API is hit once, not on every key.
function debounce(fn, wait) {
  let timerId = null;

  function debounced(...args) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      timerId = null;
      fn(...args);
    }, wait);
  }

  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

module.exports = { debounce };