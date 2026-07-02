module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var body = req.body || {};
  var name = (body.name || '').toString().trim();
  var phone = (body.phone || '').toString().trim();
  var city = (body.city || '').toString().trim();
  var message = (body.message || '').toString().trim();

  if (!name || !phone || !city) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  var token = process.env.TELEGRAM_BOT_TOKEN;
  var chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ error: 'Telegram is not configured' });
    return;
  }

  var lines = [
    'Новая заявка с сайта NICORA',
    'Имя: ' + name,
    'Телефон: ' + phone,
    'Город: ' + city
  ];
  if (message) lines.push('Сообщение: ' + message);

  try {
    var tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') })
    });

    if (!tgRes.ok) {
      res.status(502).json({ error: 'Telegram delivery failed' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: 'Telegram delivery failed' });
  }
};
