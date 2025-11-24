from playwright.sync_api import Page, expect, sync_playwright
import time
import os

def verify_redesign(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:3005")

    # 2. Act: Wait for the page to load and elements to appear.
    # Wait for any text to appear to confirm page load
    expect(page.locator("body")).to_be_visible(timeout=30000)

    # Take a debug screenshot
    page.screenshot(path="verification/debug.png")

    # We expect the large Chapter number to be visible (it's huge text).
    # Also the audio player should be visible.

    # Wait for the main content to load - Genesis is usually the default
    # Note: The heading might be "Select a Book" if nothing is selected, or "Genesis" if default.
    # Let's check for either.

    try:
        expect(page.get_by_role("heading", name="Genesis")).to_be_visible(timeout=5000)
    except:
        print("Genesis heading not found, checking if Select a Book is shown")
        expect(page.get_by_role("heading", name="Select a Book")).to_be_visible()

    # Check for the "Book" button at the bottom (text is lowercase in screenshot but name should match text content usually, or we use text locator)
    # In the screenshot it says "book" and "1"
    expect(page.get_by_role("button", name="book")).to_be_visible()

    # Check for the "Chapter" button at the bottom
    # It might be "Chapter" if no chapter is selected
    try:
        expect(page.get_by_role("button", name="1")).to_be_visible(timeout=2000)
    except:
        expect(page.get_by_role("button", name="chapter")).to_be_visible()

    # Take a screenshot of the main view
    page.screenshot(path="verification/redesign_main.png")

    # 3. Act: Open the Book Drawer
    page.get_by_role("button", name="book").click()

    # Wait for drawer to open
    # The title inside the drawer is "Select Book" (from code: <DrawerTitle>{t('selectBook')}</DrawerTitle>)
    expect(page.get_by_role("heading", name="Select Book")).to_be_visible()
    time.sleep(1) # wait for animation

    # Take a screenshot of the Book Drawer
    page.screenshot(path="verification/redesign_book_drawer.png")

    # Close drawer (click outside or use close button if available - clicking overlay is tricky in headless sometimes)
    # Let's reload to reset state for next test part or just continue
    page.reload()
    expect(page.locator("body")).to_be_visible()

    # 4. Act: Open Chapter Drawer
    # Only if a book is selected can we select a chapter
    if page.get_by_role("button", name="1").is_visible():
        page.get_by_role("button", name="1").click()

        # Wait for drawer
        expect(page.get_by_text("Select Chapter")).to_be_visible()
        time.sleep(1)

        # Take a screenshot of Chapter Drawer
        page.screenshot(path="verification/redesign_chapter_drawer.png")

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Set viewport to mobile size to test the design effectively
        page.set_viewport_size({"width": 375, "height": 812})
        try:
            verify_redesign(page)
            print("Verification script completed successfully.")
        except Exception as e:
            print(f"Verification script failed: {e}")
        finally:
            browser.close()
