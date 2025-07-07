const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { videoUrl: null, error: null });
});

app.post('/download', async (req, res) => {
  const doodUrl = req.body.url;

  try {
    const response = await axios.get(doodUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);

    // Ambil script yang berisi 'sources'
    const scriptContent = $('script').filter((i, el) => {
      return $(el).html().includes('sources');
    }).html();

    const match = scriptContent.match(/sources:\s*\[\{file:"(.*?)"/);
    const videoUrl = match ? match[1] : null;

    if (videoUrl) {
      res.render('index', { videoUrl, error: null });
    } else {
      res.render('index', { videoUrl: null, error: 'Gagal menemukan link video.' });
    }

  } catch (err) {
    console.error(err);
    res.render('index', { videoUrl: null, error: 'Terjadi kesalahan saat mengakses URL.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
