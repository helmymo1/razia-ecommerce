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
        # -> Click the language switch button to change language to Arabic.
        frame = context.pages[-1]
        # Click the 'en' button to switch language to Arabic
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Scroll down to reveal more content and then extract content again to verify Arabic product names, descriptions, and UI labels.
        await page.mouse.wheel(0, await page.evaluate('() => window.innerHeight'))
        

        # -> Click the language switch button to switch back to English and verify UI text and alignment again.
        frame = context.pages[-1]
        # Click the 'en' button to switch language back to English
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the language switch button to switch language back to English.
        frame = context.pages[-1]
        # Click the 'ar' button to switch language to English
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the language switch button to switch language to Arabic.
        frame = context.pages[-1]
        # Click the 'ar' button to switch language to Arabic
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the language switch button to switch language to Arabic.
        frame = context.pages[-1]
        # Click the 'ar' button to switch language to Arabic
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the language switch button to switch language back to English and verify UI text and alignment.
        frame = context.pages[-1]
        # Click the 'en' button to switch language to English
        elem = frame.locator('xpath=html/body/div/div[2]/header/div/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=الرئيسية').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=تسوق').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=الفئات').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=منسق الأزياء').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=من نحن').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اتصل بنا').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=New Collection 2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=أناقة خالدة').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اكتشفي مجموعتنا المنسقة من الأزياء الفاخرة').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=تسوقي الآن').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=استكشفي المجموعة').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trousers').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Vests').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Skirts').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=New Arrivals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tops').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mix & Match').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Jumpsuits').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dresses').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=أحدث الوصولات').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=عرض الكل').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=أضيفي للسلة').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Satin Printed Dress').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=غير مصنف').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=SAR 0').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Two-Tone Vest & Trouser Set').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Blouse with Colorful Shawl').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Classic Linen Top').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Linen Jumpsuit with Embroidered Side Panel').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Vest With Side Panel').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Wrap Skirt with Colorful Panel').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Wide-Leg Trouser with Colorful Side Skirt').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=فلسفتنا').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=في رازيا، نؤمن أن الموضة فن. كل قطعة تم اختيارها بعناية لتجسد الأناقة والجودة والأسلوب الخالد.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Every piece in our collection tells a story of craftsmanship, quality, and timeless design. We source the finest materials from around the world and work with skilled artisans who share our passion for excellence.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اقرأي المزيد').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ابتكري إطلالتك المثالية').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=امزجي القطع لابتكار إطلالتك الفريدة').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3 items').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=20%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4 items').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=25%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5 items').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Start Building').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اشتركي في النشرة البريدية').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اشتراك').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Razia').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Quick Links').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=تسوق').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=من نحن').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=اتصل بنا').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=الفئات').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=تابعينا').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=طرق الدفع').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2025 Razia. جميع الحقوق محفوظة').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    