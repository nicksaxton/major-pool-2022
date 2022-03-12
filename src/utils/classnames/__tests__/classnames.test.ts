import classnames from '..';

describe('classnames utility function', () => {
  describe('when undefined params are provided', () => {
    it('ignores them', () => {
      expect(classnames(undefined, undefined)).toEqual('');
    });
  });

  describe('when a single string is provided', () => {
    it('returns the provided string', () => {
      expect(classnames('foo')).toEqual('foo');
    });
  });

  describe('when multiple strings are provided', () => {
    it('returns a string concatenation of the provided strings', () => {
      expect(classnames('foo', 'bar', 'baz')).toEqual('foo bar baz');
    });
  });

  describe('when a single record is provided', () => {
    it("returns a concatenation of the record's keys whose values evaluate to true", () => {
      const param = {
        foo: true,
        bar: false,
        baz: true,
      };

      expect(classnames(param)).toEqual('foo baz');
    });
  });

  describe('when multiple records are provided', () => {
    it("returns a concatenation of the record's keys whose values evaluate to true", () => {
      const param1 = {
        foo: true,
        bar: false,
        baz: true,
      };

      const param2 = {
        a: false,
        b: false,
        c: true,
      };

      expect(classnames(param1, param2)).toEqual('foo baz c');
    });
  });

  describe('when a mix of strings and records are provided', () => {
    it("returns a concatenation of the provided string params and the record params' keys whose values evaluate to true", () => {
      const param1 = {
        foo: true,
        bar: false,
        baz: true,
      };

      const param2 = {
        a: false,
        b: false,
        c: true,
      };

      expect(classnames(param1, 'test', param2)).toEqual('foo baz test c');
    });
  });
});
