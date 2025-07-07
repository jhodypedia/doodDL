const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);
    const scriptContent = $('script').filter((i, el) => {
      return $(el).html()?.includes('sources');
    }).html();

    if (!scriptContent) {
      return res.status(400).json({ error: 'Script sources tidak ditemukan.' });
    }

    const match = scriptContent.match(/sources:\s*\[\{file:"(.*?)"/);
    if (!match || !match[1]) {
      return res.status(400).json({ error: 'Link video tidak ditemukan.' });
    }

    const videoUrl = match[1];
    res.json({ videoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat halaman atau format tidak sesuai.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
