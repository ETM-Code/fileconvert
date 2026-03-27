import { chromium, type Page } from "playwright"
import { join } from "path"

const BASE_URL = "http://localhost:3847"
const FIXTURES_DIR = join(import.meta.dir, "test-fixtures")

async function selectFormatAndConvert(page: Page, fixture: string, searchTerm: string): Promise<boolean> {
  // Upload file
  await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, fixture))
  await page.waitForTimeout(1200)

  // Dismiss auto-opened popover first, then reopen cleanly
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)

  // Click the format picker trigger button (it contains "Choose output format..." or the selected format name)
  const formatTrigger = page.locator("[data-slot=popover-trigger]")
  await formatTrigger.waitFor({ state: "visible", timeout: 5000 })
  await formatTrigger.click()
  await page.waitForTimeout(500)

  // Type to search in the command input
  const cmdInput = page.locator("[data-slot=command-input]")
  await cmdInput.waitFor({ state: "visible", timeout: 5000 })
  await cmdInput.fill(searchTerm)
  await page.waitForTimeout(500)

  // Click the first matching command item
  const items = page.locator("[data-slot=command-item]")
  const count = await items.count()
  if (count === 0) {
    console.log(`  No items found for "${searchTerm}"`)
    return false
  }

  const firstText = await items.first().textContent()
  console.log(`  Selected: "${firstText?.trim()}" (${count} results)`)
  await items.first().click()
  await page.waitForTimeout(500)

  // Click Convert
  const convertBtn = page.locator("button").filter({ hasText: "Convert" })
  const isEnabled = await convertBtn.isEnabled().catch(() => false)
  if (!isEnabled) {
    console.log("  Convert button is disabled")
    return false
  }

  await convertBtn.click()

  // Wait for completion
  try {
    await page.waitForSelector("text=Download", { timeout: 20000 })
    return true
  } catch {
    console.log("  Timed out waiting for Download button")
    return false
  }
}

async function runTests() {
  console.log("Starting Convertify E2E tests...\n")

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()

  let passed = 0
  let failed = 0

  const test = async (name: string, fn: () => Promise<void>) => {
    console.log(`--- ${name} ---`)
    try {
      await fn()
      console.log("  PASSED\n")
      passed++
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log(`  FAILED: ${msg}\n`)
      failed++
    }
  }

  await test("Page loads with all UI elements", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      assert(await page.title() === "Convertify", "Wrong title")
      assert(await page.locator("text=Drop a file here").isVisible(), "No drop zone")
      assert(await page.locator("text=100% Client-side").isVisible(), "No badge")
      assert(await page.locator("text=Your files never leave your browser").isVisible(), "No footer")
    } finally {
      await page.close()
    }
  })

  await test("File upload shows name and size", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      await page.locator("input[type=file]").setInputFiles(join(FIXTURES_DIR, "test.json"))
      await page.waitForTimeout(500)
      assert(await page.locator("text=test.json").isVisible(), "File name not shown")
    } finally {
      await page.close()
    }
  })

  await test("JSON to YAML conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.json", "YAML")
      assert(success, "Conversion failed")
      assert(await page.locator("text=test.yaml").isVisible(), "Wrong output filename")
    } finally {
      await page.close()
    }
  })

  await test("JSON to XML conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.json", "XML")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("JSON to TOML conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.json", "TOML")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("Markdown to HTML conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.md", "HTML")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("TXT to ZIP compression", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.txt", "ZIP")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("CSV to JSON conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.csv", "JSON")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("SVG to PNG conversion", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      const success = await selectFormatAndConvert(page, "test.svg", "SVG to PNG")
      assert(success, "Conversion failed")
    } finally {
      await page.close()
    }
  })

  await test("Reset flow works", async () => {
    const page = await context.newPage()
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle" })
      await selectFormatAndConvert(page, "test.json", "YAML")
      await page.locator("text=Convert another file").click()
      await page.waitForTimeout(500)
      assert(await page.locator("text=Drop a file here").isVisible(), "Reset failed")
    } finally {
      await page.close()
    }
  })

  // Summary
  console.log("=".repeat(50))
  console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed}`)
  console.log("=".repeat(50))

  await browser.close()
  process.exit(failed > 0 ? 1 : 0)
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

runTests().catch((e) => {
  console.error("Test runner error:", e)
  process.exit(1)
})
