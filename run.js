const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { videoUrl: null, error: null });
});

app.post('/download', async (req, res) => {
  const doodUrl = req.body.url;

  try {
    if (!doodUrl.includes('dood')) {
      return res.render('index', { videoUrl: null, error: 'Bukan URL Doodstream!' });
    }

    const response = await axios.get(doodUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(response.data);
    const scriptContent = $('script').filter((i, el) => $(el).html().includes('player_data')).html();

    const match = scriptContent.match(/sources:\s*\[{file:"(.*?)"/);
    const videoUrl = match ? match[1] : null;

    if (videoUrl) {
      res.render('index', { videoUrl, error: null });
    } else {
      res.render('index', { videoUrl: null, error: 'Gagal mengambil link video.' });
    }
  } catch (error) {
    res.render('index', { videoUrl: null, error: 'Terjadi kesalahan.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
