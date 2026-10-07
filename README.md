# Lab Q6: Testing timers with Jest fake timers

Tests a **debounced search** (`debounce.js`) and a **retry-with-delay** function (`retry.js`)
without any real waiting.

## Run
```powershell
npm install
npm run demo:real        # BEFORE: same logic with real waiting (about 3.5 s)
npm test                 # AFTER: 12 tests with fake timers (milliseconds)
npm run test:coverage    # coverage table
```

## Commits to make
```powershell
git init
git add package.json .gitignore README.md
git commit -m "chore: project setup"

git add debounce.js debounce.test.js
git commit -m "feat: debounce with fake-timer tests"

git add retry.js retry.test.js
git commit -m "feat: retryWithDelay with fake-timer tests"

git add real-timers-demo.js
git commit -m "docs: real-timers demo to compare speed"
```
