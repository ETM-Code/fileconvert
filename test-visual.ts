import { chromium } from "playwright"
import { join } from "path"

const BASE_URL = "http://localhost:3847"
const FIXTURES_DIR = join(import.meta.dir, "test-fixtures")
const SCREENSHOTS_DIR = join(import.meta.dir, ".screenshots")

async function main() {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

  // Capture console errors
  const errors: string[] = []

  // 1. Home page
  console.log("\n=== 1. Home page ===")
  const page = await context.newPage()
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`[${msg.type()}] ${msg.text()}`)
      console.log(`  CONSOLE ERROR: ${msg.text()}`)
    }
  })
  page.on("pageerror", (err) => {
    errors.push(`[pageerror] ${err.message}`)
    console.log(`  PAGE ERROR: ${err.message}`)
  })

  await page.goto(BASE_URL, { waitUntil: "networkidle" })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "01-home.png"), fullPage: true })
  console.log("  Screenshot: 01-home.png")

  // 2. Hover over drop zone
  console.log("\n=== 2. Hover drop zone ===")
  const dropZone = page.locator("text=Drop a file here").locator("..")
  await dropZone.hover()
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "02-hover.png"), fullPage: true })
  console.log("  Screenshot: 02-hover.png")

  // 3. Upload a JSON file
  console.log("\n=== 3. Upload JSON file ===")
  await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, "test.json"))
  await page.waitForTimeout(1000)
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "03-file-uploaded.png"), fullPage: true })
  console.log("  Screenshot: 03-file-uploaded.png")

  // 4. Format picker auto-opens
  console.log("\n=== 4. Format picker ===")
  await page.waitForTimeout(800)
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "04-format-picker.png"), fullPage: true })
  console.log("  Screenshot: 04-format-picker.png")

  // 5. Search for YAML
  console.log("\n=== 5. Search YAML ===")
  const cmdInput = page.locator("[data-slot=command-input]")
  if (await cmdInput.isVisible()) {
    await cmdInput.fill("YAML")
    await page.waitForTimeout(500)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "05-search-yaml.png"), fullPage: true })
    console.log("  Screenshot: 05-search-yaml.png")

    // Select YAML
    const items = page.locator("[data-slot=command-item]")
    await items.first().click()
    await page.waitForTimeout(500)
  }

  // 6. Format selected, convert button visible
  console.log("\n=== 6. Format selected ===")
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "06-format-selected.png"), fullPage: true })
  console.log("  Screenshot: 06-format-selected.png")

  // 7. Click wrench for settings
  console.log("\n=== 7. Settings dialog ===")
  const allButtons = page.locator("button")
  const buttonCount = await allButtons.count()
  for (let i = 0; i < buttonCount; i++) {
    const btn = allButtons.nth(i)
    const ariaLabel = await btn.getAttribute("aria-label").catch(() => null)
    const text = await btn.textContent().catch(() => "")
    // Find the wrench button (it's the icon-only button near Convert)
    if (text?.trim() === "" && await btn.isVisible() && await btn.isEnabled()) {
      const classList = await btn.getAttribute("class") || ""
      if (classList.includes("icon") || text?.trim() === "") {
        await btn.click()
        await page.waitForTimeout(500)
        const dialogVisible = await page.locator("text=Conversion Settings").isVisible()
        if (dialogVisible) {
          await page.screenshot({ path: join(SCREENSHOTS_DIR, "07-settings.png"), fullPage: true })
          console.log("  Screenshot: 07-settings.png")
          await page.keyboard.press("Escape")
          await page.waitForTimeout(300)
          break
        }
      }
    }
  }

  // 8. Click Convert
  console.log("\n=== 8. Converting ===")
  const convertBtn = page.locator("button").filter({ hasText: "Convert" })
  if (await convertBtn.isEnabled()) {
    await convertBtn.click()
    await page.waitForTimeout(200)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "08-converting.png"), fullPage: true })
    console.log("  Screenshot: 08-converting.png")

    // Wait for completion
    try {
      await page.waitForSelector("text=Download", { timeout: 15000 })
      await page.waitForTimeout(500)
      await page.screenshot({ path: join(SCREENSHOTS_DIR, "09-done.png"), fullPage: true })
      console.log("  Screenshot: 09-done.png")
    } catch {
      console.log("  FAILED: Conversion did not complete")
      await page.screenshot({ path: join(SCREENSHOTS_DIR, "09-error.png"), fullPage: true })
    }
  }

  // 10. Download
  console.log("\n=== 9. Download ===")
  const downloadBtn = page.locator("button").filter({ hasText: "Download" })
  if (await downloadBtn.isVisible()) {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 5000 }).catch(() => null),
      downloadBtn.click()
    ])
    if (download) {
      console.log(`  Downloaded: ${download.suggestedFilename()}`)
    }
    await page.waitForTimeout(500)
  }

  // 11. Reset
  console.log("\n=== 10. Reset ===")
  const resetLink = page.locator("text=Convert another file")
  if (await resetLink.isVisible()) {
    await resetLink.click()
    await page.waitForTimeout(800)
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "10-reset.png"), fullPage: true })
    console.log("  Screenshot: 10-reset.png")
  }

  // 12. Test with SVG file
  console.log("\n=== 11. SVG to PNG ===")
  await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, "test.svg"))
  await page.waitForTimeout(1200)
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  const trigger2 = page.locator("[data-slot=popover-trigger]")
  await trigger2.click()
  await page.waitForTimeout(500)

  const cmdInput2 = page.locator("[data-slot=command-input]")
  await cmdInput2.fill("PNG")
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(SCREENSHOTS_DIR, "11-svg-format.png"), fullPage: true })

  const pngItem = page.locator("[data-slot=command-item]").first()
  await pngItem.click()
  await page.waitForTimeout(500)

  const convertBtn2 = page.locator("button").filter({ hasText: "Convert" })
  await convertBtn2.click()

  try {
    await page.waitForSelector("text=Download", { timeout: 20000 })
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "12-svg-done.png"), fullPage: true })
    console.log("  SVG to PNG: PASSED")
  } catch {
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "12-svg-error.png"), fullPage: true })
    console.log("  SVG to PNG: FAILED")
  }

  // 13. Test with markdown
  console.log("\n=== 12. Markdown to HTML ===")
  await page.locator("text=Convert another file").click().catch(() => {})
  await page.waitForTimeout(500)

  // If no reset link, go back to home
  const dropVisible = await page.locator("text=Drop a file here").isVisible()
  if (!dropVisible) {
    await page.goto(BASE_URL, { waitUntil: "networkidle" })
    await page.waitForTimeout(500)
  }

  await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, "test.md"))
  await page.waitForTimeout(1200)
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  const trigger3 = page.locator("[data-slot=popover-trigger]")
  await trigger3.click()
  await page.waitForTimeout(500)

  const cmdInput3 = page.locator("[data-slot=command-input]")
  await cmdInput3.fill("HTML")
  await page.waitForTimeout(500)

  const htmlItem = page.locator("[data-slot=command-item]").first()
  await htmlItem.click()
  await page.waitForTimeout(500)

  await page.locator("button").filter({ hasText: "Convert" }).click()

  try {
    await page.waitForSelector("text=Download", { timeout: 15000 })
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "13-md-done.png"), fullPage: true })
    console.log("  Markdown to HTML: PASSED")
  } catch {
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "13-md-error.png"), fullPage: true })
    console.log("  Markdown to HTML: FAILED")
  }

  // 14. Test with CSV
  console.log("\n=== 13. CSV to JSON ===")
  await page.locator("text=Convert another file").click().catch(() => {})
  await page.waitForTimeout(500)
  if (!(await page.locator("text=Drop a file here").isVisible())) {
    await page.goto(BASE_URL, { waitUntil: "networkidle" })
  }

  await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, "test.csv"))
  await page.waitForTimeout(1200)
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  await page.locator("[data-slot=popover-trigger]").click()
  await page.waitForTimeout(500)
  await page.locator("[data-slot=command-input]").fill("JSON")
  await page.waitForTimeout(500)
  await page.locator("[data-slot=command-item]").first().click()
  await page.waitForTimeout(500)

  await page.locator("button").filter({ hasText: "Convert" }).click()

  try {
    await page.waitForSelector("text=Download", { timeout: 15000 })
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "14-csv-done.png"), fullPage: true })
    console.log("  CSV to JSON: PASSED")
  } catch {
    await page.screenshot({ path: join(SCREENSHOTS_DIR, "14-csv-error.png"), fullPage: true })
    console.log("  CSV to JSON: FAILED")
  }

  // Summary
  console.log("\n=== Summary ===")
  console.log(`Console errors collected: ${errors.length}`)
  errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`))

  await page.waitForTimeout(2000)
  await browser.close()
}

main().catch(console.error)
