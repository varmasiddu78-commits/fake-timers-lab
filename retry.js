// Runs an async function and retries it when it fails.
// Waits delayMs before the first retry; each later wait is multiplied by `backoff`.
// With retries = 3 the function can run up to 4 times (1 try + 3 retries).
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithDelay(fn, { retries = 3, delayMs = 1000, backoff = 1 } = {}) {
  let wait = delayMs;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(wait);
        wait *= backoff;
      }
    }
  }
  throw lastError;
}

module.exports = { retryWithDelay };
