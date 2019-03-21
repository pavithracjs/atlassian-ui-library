import createEventStream from '../event-stream';

describe('event-stream', () => {
  describe('next', () => {
    it('should wait for the next call entering the stream', done => {
      const stream = createEventStream();
      const sentValue = { some: 'value' };
      stream.next().then(valueFromStream => {
        expect(valueFromStream).toBe(sentValue);
        done();
      });
      stream(sentValue);
    });
    it('should be able to return values already sent to the stream', done => {
      const stream = createEventStream();
      const sentValue = { some: 'value' };
      stream(sentValue);
      stream.next().then(valueFromStream => {
        expect(valueFromStream).toBe(sentValue);
        done();
      });
    });
  });
  describe('skip', () => {
    it('should be able to return the skipped values entering the stream', done => {
      const stream = createEventStream();
      const skippedValues = ['a', 'b', 'c'];
      stream.skip(3).then(resolvedSkippedValues => {
        expect(resolvedSkippedValues).toMatchObject(skippedValues);
        done();
      });
      stream(skippedValues[0]);
      stream(skippedValues[1]);
      stream(skippedValues[2]);
    });
    it('should be able to return the skipped values already sent to the stream', done => {
      const stream = createEventStream();
      const skippedValues = ['a', 'b', 'c'];
      stream(skippedValues[0]);
      stream(skippedValues[1]);
      stream(skippedValues[2]);
      stream.skip(3).then(resolvedSkippedValues => {
        expect(resolvedSkippedValues).toMatchObject(skippedValues);
        done();
      });
    });
  });
  it('should both next + skip operations', done => {
    const stream = createEventStream();
    const initialValue = 'a';
    const skippedValues = ['a', 'b', 'c'];
    stream
      .next()
      .then(resolvedInitialValue => {
        expect(resolvedInitialValue).toBe(initialValue);
        stream(skippedValues[0]);
        stream(skippedValues[1]);
        stream(skippedValues[2]);
        return stream.skip(3);
      })
      .then(resolvedSkippedValues => {
        expect(resolvedSkippedValues).toMatchObject(skippedValues);
        done();
      });
    stream(initialValue);
  });
  it('should both skip + next operations', done => {
    const stream = createEventStream();
    const initialValue = 'a';
    const skippedValues = ['a', 'b', 'c'];
    stream
      .next()
      .then(resolvedInitialValue => {
        expect(resolvedInitialValue).toBe(initialValue);
        stream(skippedValues[0]);
        stream(skippedValues[1]);
        stream(skippedValues[2]);
        return stream.skip(3);
      })
      .then(resolvedSkippedValues => {
        expect(resolvedSkippedValues).toMatchObject(skippedValues);
        done();
      });
    stream(initialValue);
  });
});
