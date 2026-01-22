import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Add products to cart by clicking 'Add to Cart' buttons for some items.
        frame = context.pages[-1]
        # Click 'Add to Cart' button for the first product (Satin Printed Dress)
        elem = frame.locator('xpath=html/body/div/div[2]/main/section[3]/div[2]/div[2]/div/a/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the Checkout page by clicking the Cart button.
        frame = context.pages[-1]
        # Click on Cart button to go to Checkout page
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Return to shopping page and re-add products to cart, then navigate to checkout again.
        frame = context.pages[-1]
        # Click 'Continue Shopping' to return to shopping page
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Add a product to cart again and then navigate to the cart to verify if the product is retained.
        frame = context.pages[-1]
        # Click 'Add to Cart' button for 'White & Light Purple Panel Top'
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div[2]/div/div[3]/a/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Checkout' button in the cart sidebar to navigate to the Checkout page.
        frame = context.pages[-1]
        # Click 'Checkout' button in the cart sidebar
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input email and password into correct input fields and click Sign In button to login.
        frame = context.pages[-1]
        # Enter email for login
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testuser@example.com')
        

        frame = context.pages[-1]
        # Enter password for login
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestPassword123')
        

        frame = context.pages[-1]
        # Click 'Sign In' button to login
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Sign Up' button to create a new account for checkout testing.
        frame = context.pages[-1]
        # Click 'Sign Up' button to create a new account
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/p/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Proceed to fill the Create Account form with valid details using correct input fields and submit the form.
        frame = context.pages[-1]
        # Click 'Sign Up' button again to ensure on Create Account page
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/p/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the Create Account form with valid user details and submit to create account.
        frame = context.pages[-1]
        # Enter First Name
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test')
        

        frame = context.pages[-1]
        # Enter Last Name
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('User')
        

        frame = context.pages[-1]
        # Enter Email
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('testuser@example.com')
        

        frame = context.pages[-1]
        # Enter Password
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestPassword123')
        

        frame = context.pages[-1]
        # Confirm Password
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('TestPassword123')
        

        frame = context.pages[-1]
        # Click 'Create Account' button to submit the form
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Continue Shopping' button to return to shop and add products to cart again while logged in.
        frame = context.pages[-1]
        # Click 'Continue Shopping' button to return to shop page
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[3]/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Add products to cart by clicking 'Add to Cart' buttons for some items.
        frame = context.pages[-1]
        # Click 'Add to Cart' button for 'Drape Elegant Trouser'
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div[2]/div/div/a/div/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Checkout' button in the cart sidebar to navigate to the Checkout page.
        frame = context.pages[-1]
        # Click 'Checkout' button in the cart sidebar
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/div[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Complete your purchase securely').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cart').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Shipping').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Payment').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Confirmation').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Order Summary').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Subtotal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Shipping').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=VAT (15%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Subscribe to our newsletter').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Subscribe').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    