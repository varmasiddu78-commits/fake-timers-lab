// Shows why fake timers matter: the same checks with REAL waiting are slow.
// Run: npm run demo:real
const { debounce } = require('./debounce');
const { retryWithDelay } = require('./retry');

async function main() {
  const start = Date.now();

  // 1) debounce with a real 500 ms wait
  let called = 0;
  const search = debounce(() => { called++; }, 500);
  search('react');
  await new Promise((r) => setTimeout(r, 550));
  console.log('debounce called after real wait:', called === 1 ? 'yes' : 'no');

  // 2) retry with real waits of 1000 ms + 2000 ms
  let tries = 0;
  const result = await retryWithDelay(
    async () => {
      tries++;
      if (tries < 3) throw new Error('fail ' + tries);
      return 'ok';
    },
    { retries: 3, delayMs: 1000, backoff: 2 }
  );
  console.log('retry result:', result, 'after', tries, 'tries');

  console.log('Total real time: ' + ((Date.now() - start) / 1000).toFixed(2) + ' s');
}

main();
