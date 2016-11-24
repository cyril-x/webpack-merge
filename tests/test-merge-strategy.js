/* eslint-env mocha */
const assert = require('assert');
const webpackMerge = require('..');
const normalMergeTests = require('./test-merge');
const mergeTests = require('./merge-tests');

describe('Merge strategy', function () {
  const merge = webpackMerge.strategy;

  normalMergeTests(merge(), [
    'preLoaders',
    'loaders',
    'postLoaders',
    'rules'
  ]);
  mergeTests(merge());
  mergeStrategyTests(merge);
});

function mergeStrategyTests(merge) {
  it('should allow setting to array append', function () {
    const a = {
      entry: ['foo', 'bar', 'baz']
    };
    const b = {
      entry: ['zoo']
    };
    const result = {
      entry: ['foo', 'bar', 'baz', 'zoo']
    };

    assert.deepEqual(merge({
      entry: 'append'
    })(a, b), result);
  });

  it('should allow setting to array prepend', function () {
    const a = {
      entry: ['foo', 'bar', 'baz']
    };
    const b = {
      entry: ['zoo']
    };
    const result = {
      entry: ['zoo', 'foo', 'bar', 'baz']
    };

    assert.deepEqual(merge({
      entry: 'prepend'
    })(a, b), result);
  });

  it('should work with nested arrays and prepend', function () {
    const a = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/
          }
        ]
      }
    };
    const b = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['react-hot'],
            exclude: /node_modules/
          }
        ]
      }
    };
    const result = {
      module: {
        loaders: [
          {
            test: /.jsx?$/,
            loaders: ['react-hot'],
            exclude: /node_modules/
          },
          {
            test: /.jsx?$/,
            loaders: ['babel'],
            exclude: /node_modules/
          }
        ]
      }
    };

    assert.deepEqual(merge({
      'module.loaders': 'prepend'
    })(a, b), result);
  });

  it('should allow setting to object append', function () {
    const a = {
      entry: {
        foo: 'bar'
      }
    };
    const b = {
      entry: {
        bar: 'baz'
      }
    };
    const result = {
      entry: {
        foo: 'bar',
        bar: 'baz'
      }
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'append'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });

  it('should allow setting to object prepend', function () {
    const a = {
      entry: {
        foo: 'bar'
      }
    };
    const b = {
      entry: {
        bar: 'baz'
      }
    };
    const result = {
      entry: {
        bar: 'baz',
        foo: 'bar'
      }
    };

    assert.deepEqual(
      Object.keys(merge({
        entry: 'prepend'
      })(a, b).entry),
      Object.keys(result.entry)
    );
  });
}