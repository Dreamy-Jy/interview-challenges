import { chromium, Page } from "npm:playwright";

const solutions: Record<number, string> = JSON.parse(
  Deno.readTextFileSync("../../data/solutions.better.json"),
);
let currentLevel = 1;
const raw_id = "766ebb4d-289f-4038-9fa9-59db2c66693d";

async function typeSolution(
  page: Page,
  solutions: Record<number, string>,
  level: number,
) {
  for (const char of solutions[level]) {
    await page.keyboard.press(char);
  }
}

// create a new browser instance
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: null });
const page = await context.newPage();

// set the browser window to fullscreen
const session = await context.newCDPSession(page);
const { windowId } = await session.send("Browser.getWindowForTarget");
await session.send("Browser.setWindowBounds", {
  windowId,
  bounds: { windowState: "fullscreen" },
});

// add event listeners for debugging
page.on("console", async (msg) => {
  for (const arg of msg.args()) {
    try {
      const value = await arg.jsonValue();
      if (typeof value === "object" && "level" in value) {
        console.log(`We're about to solve level: ${value.level}`);
        console.log(`Our Solution: ${solutions[value.level]}`);
        currentLevel = value.level;
      }
    } catch (error) {
      console.error("Error parsing console message:", error);
    }
  }
  console.log(`[browser:${msg.type()}] ${msg.text()}`);
});
page.on(
  "request",
  (request) =>
    console.log(`[network request] ${request.method()} ${request.url()}`),
);
page.on(
  "response",
  (response) =>
    console.log(`[network response] ${response.status()} ${response.url()}`),
);

// navigate to the game page
await page.goto("https://jobbo.n1.xyz/");

// login to the game
await page.waitForSelector("#ashbyId", { timeout: 3000 });
await page.fill("#ashbyId", raw_id);

await page.waitForSelector(".game-button", { timeout: 3000 });
await page.click(".game-button");

// click the start button
await page.click(".game-button");

// put in all the solutions
while (currentLevel <= 1000) {
  await typeSolution(page, solutions, currentLevel);

  await page.waitForTimeout(600); // Wait for a second before checking the next level
}
