// @flow
import translateEvent from '../../utils/translateEvent';

test('should not call e.target when the argument is null and return the argument', () => {
  const withNull = translateEvent(null);

  expect(withNull).toEqual(null);
});

test('should the argument when it is not an event object', () => {
  const withArray = translateEvent([]);

  expect(withArray).toEqual([]);
});

test('should return the event.target.value value if the target is not a checkbox', () => {
  const event = {
    target: {
      value: 'Tester',
    },
  };
  const withEvent = translateEvent(event);

  expect(withEvent).toEqual('Tester');
});

test('should return the event.target.value if the target is a checkbox and is checked and there is a value', () => {
  const event = {
    target: {
      type: 'checkbox',
      checked: true,
      value: 'Tester',
    },
  };
  const withEvent = translateEvent(event);

  expect(withEvent).toEqual('Tester');
});

test('should return true if the target is a checkbox and is checked and there is no value', () => {
  const event = {
    target: {
      type: 'checkbox',
      checked: true,
    },
  };
  const withEvent = translateEvent(event);

  expect(withEvent).toBe(true);
});

test('should return false if the target is a checkbox and is not checked and there is no value', () => {
  const event = {
    target: {
      type: 'checkbox',
      checked: false,
    },
  };
  const withEvent = translateEvent(event);

  expect(withEvent).toBe(false);
});

test('should return undefined if the target is a checkbox and is not checked and there is no value', () => {
  const event = {
    target: {
      type: 'checkbox',
      checked: false,
      value: 'Tester',
    },
  };
  const withEvent = translateEvent(event);

  expect(withEvent).toBe(undefined);
});
