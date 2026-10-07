const { debounce } = require('./debounce');

describe('debounce (fake timers)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('does not call the function before the wait has passed', () => {
    const fn = jest.fn();
    const search = debounce(fn, 500);

    search('rea');
    jest.advanceTimersByTime(499);

    expect(fn).not.toHaveBeenCalled();
  });

  test('calls the function once after the wait has passed', () => {
    const fn = jest.fn();
    const search = debounce(fn, 500);

    search('react');
    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('react');
  });

  test('typing quickly resets the timer and calls once with the last value', () => {
    const fn = jest.fn();
    const search = debounce(fn, 500);

    search('r');
    jest.advanceTimersByTime(200);
    search('re');
    jest.advanceTimersByTime(200);
    search('rea');
    jest.advanceTimersByTime(499);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('rea');
  });

  test('two separate bursts of typing give two calls', () => {
    const fn = jest.fn();
    const search = debounce(fn, 500);

    search('one');
    jest.advanceTimersByTime(500);
    search('two');
    jest.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'one');
    expect(fn).toHaveBeenNthCalledWith(2, 'two');
  });

  test('cancel stops a pending call', () => {
    const fn = jest.fn();
    const search = debounce(fn, 500);

    search('react');
    search.cancel();
    jest.advanceTimersByTime(1000);

    expect(fn).not.toHaveBeenCalled();
  });

  test('cancel with nothing pending does nothing', () => {
    const search = debounce(jest.fn(), 500);

    expect(() => search.cancel()).not.toThrow();
  });
});
