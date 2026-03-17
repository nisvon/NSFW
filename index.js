const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const PORT = process.env.PORT || 3000

const ORIGIN = 'https://bliss-arsenal.lovable.app'

app.get('/health', (req, res) => res.send('OK'))

app.get('/render', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  const targetUrl = url
    .replace('https://nsfw-tools.com', ORIGIN)
    .replace('https://www.nsfw-tools.com', ORIGIN)

  let browser
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
      headless: 'new'
    })
    const page = await browser.newPage()

    // Set extra headers to avoid Lovable rejecting the request
    await page.setExtraHTTPHeaders({
      'host': 'bliss-arsenal.lovable.app',
      'origin': ORIGIN,
      'referer': ORIGIN
    })

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await new Promise(r => setTimeout(r, 3000))
    const html = await page.content()
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`)
  } finally {
    if (browser) await browser.close()
  }
})

app.listen(PORT, () => console.log(`Prerender on port ${PORT}`))
