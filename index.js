const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/render', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  let browser
  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      headless: 'new'
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 2000))
    const html = await page.content()
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    console.error(err)
    res.status(500).send(`Prerender error: ${err.message}`)
  } finally {
    if (browser) await browser.close()
  }
})

app.get('/health', (req, res) => res.send('OK'))

app.listen(PORT, () => console.log(`Prerender on port ${PORT}`))
```
Commit it.

Repeat for file 3 — name it `.gitignore` → paste:
```
node_modules/
