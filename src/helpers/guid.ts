/**
 * Creates a globally unique identifier.
 */
export function guid() {
    const hex = generateRandomHex();
    return compress(hex);
}

function generateRandomHex(length: number = 32): string {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
}

function compress(g: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_$";
  const bs: number[] = [];
  
  for (let i = 0; i < g.length; i += 2) {
    bs.push(parseInt(g.substr(i, 2), 16));
  }

  function b64(v: number, l: number = 4): string {
    const result: string[] = [];
      
    for (let i = l - 1; i >= 0; i--) {
      result.push(chars[Math.floor(v / (64 ** i)) % 64]);
    }

    return result.join('');
  }

  const result: string[] = [];
  result.push(b64(bs[0], 2));

  for (let i = 1; i < 16; i += 3) {
    const value = (bs[i] << 16) + (bs[i + 1] << 8) + bs[i + 2];
    result.push(b64(value));
  }
  return result.join('');
}