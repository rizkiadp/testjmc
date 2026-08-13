import svgCaptcha from 'svg-captcha';

// Simple in-memory captcha store with expiration
const captchaStore = new Map();

// Clean expired captchas periodically (older than 10 mins)
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of captchaStore.entries()) {
    if (now - data.timestamp > 600000) {
      captchaStore.delete(id);
    }
  }
}, 60000);

export function verifyCaptcha(id, text) {
  if (!id || !text || !captchaStore.has(id)) return false;
  const stored = captchaStore.get(id);
  captchaStore.delete(id); // Single use
  
  // Clean ambiguity character substitution (0 vs O/o, 1 vs I/l)
  const cleanStr = (str) => str.trim().toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/i/g, 'l');

  return cleanStr(stored.text) === cleanStr(text);
}

export default defineEventHandler((event) => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 1,
    color: true,
    background: '#f8f9fa',
    width: 130,
    height: 40,
    ignoreChars: '0o1iIlO'
  });

  const captchaId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  captchaStore.set(captchaId, {
    text: captcha.text,
    timestamp: Date.now()
  });

  return {
    captchaId,
    data: captcha.data
  };
});
