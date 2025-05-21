// utils/retry.js
export async function retry(fn, retries = 3, delay = 1000, description = '') {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        if (attempt === retries) {
          throw new Error(`Final retry failed (${description}): ${err.message}`);
        }
        console.warn(`Retry ${attempt} for ${description}: ${err.message}`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  