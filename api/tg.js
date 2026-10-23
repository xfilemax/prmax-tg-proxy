// PRMAX — проксі Telegram webhook → Google Apps Script («PRMAX Заявки»).
// Telegram вимагає 200 OK, а Apps Script відповідає 302, тому оновлення проходить через цю функцію.
// Webhook: https://<project>.vercel.app/api/tg?bot=client  або  ?bot=notify
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxn9Js2V9OAez1W_dnCpsALmJq8VQEIMTlX0h49e_ylNyuxowtP4bz_y5A8pGU8HRon/exec';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('prmax-tg-proxy ok');
  const bot = (req.query && req.query.bot) || 'client';
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  try {
    const r = await fetch(APPS_SCRIPT_URL + '?bot=' + encodeURIComponent(bot), {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, redirect: 'follow'
    });
    const t = await r.text();
    return res.status(200).send(t.slice(0, 200) || 'ok');
  } catch (e) {
    return res.status(200).send('ok');
  }
};
