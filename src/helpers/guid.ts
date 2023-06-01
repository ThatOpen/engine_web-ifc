/**
 * Creates a random ascii string of 22 characters
 * @returns {string} - A random string of 22 characters
 */
export function guid() {
    return "xxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g,() => {
      const r = (Math.random() * 16) | 0;
      return r.toString(16);
    });
}