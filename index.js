const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/render', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'
      }
    })
    const html = await response.text()
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`)
  }
})

app.get('/health', (req, res) => res.send('OK'))

app.listen(PORT, () => console.log(`Prerender on port ${PORT}`))
