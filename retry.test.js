const { retryWithDelay } = require('./retry');

describe('retryWithDelay (fake timers)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns the result straight away when the first try works', async () => {
    const fn = jest.fn().mockResolvedValue('ok');

    const result = await retryWithDelay(fn, { retries: 3, delayMs: 1000 });

    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('waits the delay, then retries after a failure', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValue('ok');

    const promise = retryWithDelay(fn, { retries: 3, delayMs: 1000 });

    await jest.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1); // still waiting

    await jest.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2); // retried after exactly 1000 ms

    await expect(promise).resolves.toBe('ok');
  });

  test('gives up after the retries are used and throws the last error', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('still down'));

    const assertion = expect(
      retryWithDelay(fn, { retries: 2, delayMs: 1000 })
    ).rejects.toThrow('still down');

    await jest.advanceTimersByTimeAsync(2000);
    await assertion;

    expect(fn).toHaveBeenCalledTimes(3); // 1 try + 2 retries
  });

  test('backoff doubles the wait: 1000 ms then 2000 ms', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('ok');

    const promise = retryWithDelay(fn, { retries: 3, delayMs: 1000, backoff: 2 });

    await jest.advanceTimersByTimeAsync(1000);
    expect(fn).toHaveBeenCalledTimes(2); // first retry after 1000 ms

    await jest.advanceTimersByTimeAsync(1999);
    expect(fn).toHaveBeenCalledTimes(2); // second wait is 2000 ms, not over yet

    await jest.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);

    await expect(promise).resolves.toBe('ok');
  });

  test('does not leave a timer running after the final failure', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('boom'));

    const assertion = expect(
      retryWithDelay(fn, { retries: 1, delayMs: 500 })
    ).rejects.toThrow('boom');

    await jest.advanceTimersByTimeAsync(500);
    await assertion;

    expect(jest.getTimerCount()).toBe(0);
  });

  test('uses the defaults (3 retries) when no options are given', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('down'));

    const assertion = expect(retryWithDelay(fn)).rejects.toThrow('down');

    await jest.advanceTimersByTimeAsync(3000);
    await assertion;

    expect(fn).toHaveBeenCalledTimes(4); // 1 try + 3 retries
  });
});
