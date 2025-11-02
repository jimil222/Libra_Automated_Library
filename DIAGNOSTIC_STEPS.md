# Diagnostic Steps for Blank Screen Issue

## Step 1: Verify Dev Server is Running
1. Open terminal in project folder
2. Run: `npm run dev`
3. Check that it shows: "Local: http://localhost:5173"

## Step 2: Open Browser Console
1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for these messages:
   - "Starting React render..."
   - "App component rendering"
   - "React app mounted successfully"
4. Check for any RED error messages

## Step 3: Check Network Tab
1. In DevTools, go to "Network" tab
2. Refresh the page (F5)
3. Look for `main.jsx` - should have status 200 (green)
4. Look for CSS files - should have status 200

## Step 4: Check Elements Tab
1. In DevTools, go to "Elements" tab
2. Look for `<div id="root">` 
3. Expand it - is there any content inside?

## Step 5: Try Test Page
1. Open `http://localhost:5173/test.html` directly
2. If you see red text, browser is working
3. If still blank, there's a browser/server issue

## Step 6: Clear Everything
1. Close browser completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Clear localStorage:
   - Open DevTools → Application tab
   - Left sidebar → Local Storage → http://localhost:5173
   - Right-click → Clear
4. Restart dev server
5. Try again

## Step 7: Check if React is Rendering
You should see a RED banner at the top-left saying "React is rendering..."
If you don't see this, React isn't mounting at all.

