const express = require('express')
const puppeteer = require('puppeteer-core')
const { execSync } = require('child_process')

const app = express()
const PORT = process.env.PORT || 3000

function getChromiumPath() {
  try {
    return execSync('which chromium || which chromium-browser || which google-chrome').toString().trim()
  } catch {
    return null
  }
}

app.get('/render', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  let browser
  try {
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || getChromiumPath()
    browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      headless: 'new'
    })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 2000))
    const html = await page.content()
    res.set('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`)
  } finally {
    if (browser) await browser.close()
  }
})

app.get('/health', (req, res) => {
  const path = getChromiumPath()
  res.send(`OK - chromium at: ${path}`)
})

app.listen(PORT, () => console.log(`Prerender on port ${PORT}`))
