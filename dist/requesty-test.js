(function (define) {
    function _require(index) {
        var module = _require.cache[index];
        if (!module) {
            var exports = {};
            module = _require.cache[index] = {
                id: index,
                exports: exports
            };
            _require.modules[index].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            'use strict';
            var concat = [].concat;
            var slice = [].slice;
            function assign(target, source) {
                var index = -1, props = Object.keys(source), length = props.length;
                if (!target) {
                    target = {};
                }
                while (++index < length) {
                    var key = props[index];
                    target[key] = source[key];
                }
                return target;
            }
            module.exports = {
                assign: assign,
                curry: _require(31)
            };
        },
        function (module, exports) {
            module.exports = _require(2);
        },
        function (module, exports) {
            var used = [], exports = module.exports = {};
            exports.version = '1.8.1';
            exports.AssertionError = _require(26);
            var util = _require(8);
            exports.use = function (fn) {
                if (!~used.indexOf(fn)) {
                    fn(this, util);
                    used.push(fn);
                }
                return this;
            };
            var assertion = _require(3);
            exports.use(assertion);
            var core = _require(4);
            exports.use(core);
            var expect = _require(6);
            exports.use(expect);
            var should = _require(7);
            exports.use(should);
            var assert = _require(5);
            exports.use(assert);
        },
        function (module, exports) {
            module.exports = function (_chai, util) {
                var AssertionError = _chai.AssertionError, flag = util.flag;
                _chai.Assertion = Assertion;
                function Assertion(obj, msg, stack) {
                    flag(this, 'ssfi', stack || arguments.callee);
                    flag(this, 'object', obj);
                    flag(this, 'message', msg);
                }
                Assertion.includeStack = false;
                Assertion.showDiff = true;
                Assertion.addProperty = function (name, fn) {
                    util.addProperty(this.prototype, name, fn);
                };
                Assertion.addMethod = function (name, fn) {
                    util.addMethod(this.prototype, name, fn);
                };
                Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
                    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
                };
                Assertion.overwriteProperty = function (name, fn) {
                    util.overwriteProperty(this.prototype, name, fn);
                };
                Assertion.overwriteMethod = function (name, fn) {
                    util.overwriteMethod(this.prototype, name, fn);
                };
                Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
                    var ok = util.test(this, arguments);
                    if (true !== showDiff)
                        showDiff = false;
                    if (true !== Assertion.showDiff)
                        showDiff = false;
                    if (!ok) {
                        var msg = util.getMessage(this, arguments), actual = util.getActual(this, arguments);
                        throw new AssertionError(msg, {
                            actual: actual,
                            expected: expected,
                            showDiff: showDiff
                        }, Assertion.includeStack ? this.assert : flag(this, 'ssfi'));
                    }
                };
                Object.defineProperty(Assertion.prototype, '_obj', {
                    get: function () {
                        return flag(this, 'object');
                    },
                    set: function (val) {
                        flag(this, 'object', val);
                    }
                });
            };
        },
        function (module, exports) {
            module.exports = function (chai, _) {
                var Assertion = chai.Assertion, toString = Object.prototype.toString, flag = _.flag;
                [
                    'to',
                    'be',
                    'been',
                    'is',
                    'and',
                    'have',
                    'with',
                    'that',
                    'at',
                    'of',
                    'same'
                ].forEach(function (chain) {
                    Assertion.addProperty(chain, function () {
                        return this;
                    });
                });
                Assertion.addProperty('not', function () {
                    flag(this, 'negate', true);
                });
                Assertion.addProperty('deep', function () {
                    flag(this, 'deep', true);
                });
                function an(type, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    type = type.toLowerCase();
                    var obj = flag(this, 'object'), article = ~[
                            'a',
                            'e',
                            'i',
                            'o',
                            'u'
                        ].indexOf(type.charAt(0)) ? 'an ' : 'a ';
                    this.assert(type === _.type(obj), 'expected #{this} to be ' + article + type, 'expected #{this} not to be ' + article + type);
                }
                Assertion.addChainableMethod('an', an);
                Assertion.addChainableMethod('a', an);
                function includeChainingBehavior() {
                    flag(this, 'contains', true);
                }
                function include(val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(~obj.indexOf(val), 'expected #{this} to include ' + _.inspect(val), 'expected #{this} to not include ' + _.inspect(val));
                }
                Assertion.addChainableMethod('include', include, includeChainingBehavior);
                Assertion.addChainableMethod('contain', include, includeChainingBehavior);
                Assertion.addProperty('ok', function () {
                    this.assert(flag(this, 'object'), 'expected #{this} to be truthy', 'expected #{this} to be falsy');
                });
                Assertion.addProperty('true', function () {
                    this.assert(true === flag(this, 'object'), 'expected #{this} to be true', 'expected #{this} to be false', this.negate ? false : true);
                });
                Assertion.addProperty('false', function () {
                    this.assert(false === flag(this, 'object'), 'expected #{this} to be false', 'expected #{this} to be true', this.negate ? true : false);
                });
                Assertion.addProperty('null', function () {
                    this.assert(null === flag(this, 'object'), 'expected #{this} to be null', 'expected #{this} not to be null');
                });
                Assertion.addProperty('undefined', function () {
                    this.assert(undefined === flag(this, 'object'), 'expected #{this} to be undefined', 'expected #{this} not to be undefined');
                });
                Assertion.addProperty('exist', function () {
                    this.assert(null != flag(this, 'object'), 'expected #{this} to exist', 'expected #{this} to not exist');
                });
                Assertion.addProperty('empty', function () {
                    var obj = flag(this, 'object'), expected = obj;
                    if (Array.isArray(obj) || 'string' === typeof object) {
                        expected = obj.length;
                    } else if (typeof obj === 'object') {
                        expected = Object.keys(obj).length;
                    }
                    this.assert(!expected, 'expected #{this} to be empty', 'expected #{this} not to be empty');
                });
                function checkArguments() {
                    var obj = flag(this, 'object'), type = Object.prototype.toString.call(obj);
                    this.assert('[object Arguments]' === type, 'expected #{this} to be arguments but got ' + type, 'expected #{this} to not be arguments');
                }
                Assertion.addProperty('arguments', checkArguments);
                Assertion.addProperty('Arguments', checkArguments);
                function assertEqual(val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'deep')) {
                        return this.eql(val);
                    } else {
                        this.assert(val === obj, 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{exp}', val, this._obj, true);
                    }
                }
                Assertion.addMethod('equal', assertEqual);
                Assertion.addMethod('equals', assertEqual);
                Assertion.addMethod('eq', assertEqual);
                function assertEql(obj, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    this.assert(_.eql(obj, flag(this, 'object')), 'expected #{this} to deeply equal #{exp}', 'expected #{this} to not deeply equal #{exp}', obj, this._obj, true);
                }
                Assertion.addMethod('eql', assertEql);
                Assertion.addMethod('eqls', assertEql);
                function assertAbove(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len > n, 'expected #{this} to have a length above #{exp} but got #{act}', 'expected #{this} to not have a length above #{exp}', n, len);
                    } else {
                        this.assert(obj > n, 'expected #{this} to be above ' + n, 'expected #{this} to be at most ' + n);
                    }
                }
                Assertion.addMethod('above', assertAbove);
                Assertion.addMethod('gt', assertAbove);
                Assertion.addMethod('greaterThan', assertAbove);
                function assertLeast(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len >= n, 'expected #{this} to have a length at least #{exp} but got #{act}', 'expected #{this} to have a length below #{exp}', n, len);
                    } else {
                        this.assert(obj >= n, 'expected #{this} to be at least ' + n, 'expected #{this} to be below ' + n);
                    }
                }
                Assertion.addMethod('least', assertLeast);
                Assertion.addMethod('gte', assertLeast);
                function assertBelow(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len < n, 'expected #{this} to have a length below #{exp} but got #{act}', 'expected #{this} to not have a length below #{exp}', n, len);
                    } else {
                        this.assert(obj < n, 'expected #{this} to be below ' + n, 'expected #{this} to be at least ' + n);
                    }
                }
                Assertion.addMethod('below', assertBelow);
                Assertion.addMethod('lt', assertBelow);
                Assertion.addMethod('lessThan', assertBelow);
                function assertMost(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len <= n, 'expected #{this} to have a length at most #{exp} but got #{act}', 'expected #{this} to have a length above #{exp}', n, len);
                    } else {
                        this.assert(obj <= n, 'expected #{this} to be at most ' + n, 'expected #{this} to be above ' + n);
                    }
                }
                Assertion.addMethod('most', assertMost);
                Assertion.addMethod('lte', assertMost);
                Assertion.addMethod('within', function (start, finish, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object'), range = start + '..' + finish;
                    if (flag(this, 'doLength')) {
                        new Assertion(obj, msg).to.have.property('length');
                        var len = obj.length;
                        this.assert(len >= start && len <= finish, 'expected #{this} to have a length within ' + range, 'expected #{this} to not have a length within ' + range);
                    } else {
                        this.assert(obj >= start && obj <= finish, 'expected #{this} to be within ' + range, 'expected #{this} to not be within ' + range);
                    }
                });
                function assertInstanceOf(constructor, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var name = _.getName(constructor);
                    this.assert(flag(this, 'object') instanceof constructor, 'expected #{this} to be an instance of ' + name, 'expected #{this} to not be an instance of ' + name);
                }
                ;
                Assertion.addMethod('instanceof', assertInstanceOf);
                Assertion.addMethod('instanceOf', assertInstanceOf);
                Assertion.addMethod('property', function (name, val, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var descriptor = flag(this, 'deep') ? 'deep property ' : 'property ', negate = flag(this, 'negate'), obj = flag(this, 'object'), value = flag(this, 'deep') ? _.getPathValue(name, obj) : obj[name];
                    if (negate && undefined !== val) {
                        if (undefined === value) {
                            msg = msg != null ? msg + ': ' : '';
                            throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));
                        }
                    } else {
                        this.assert(undefined !== value, 'expected #{this} to have a ' + descriptor + _.inspect(name), 'expected #{this} to not have ' + descriptor + _.inspect(name));
                    }
                    if (undefined !== val) {
                        this.assert(val === value, 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}', 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}', val, value);
                    }
                    flag(this, 'object', value);
                });
                function assertOwnProperty(name, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(obj.hasOwnProperty(name), 'expected #{this} to have own property ' + _.inspect(name), 'expected #{this} to not have own property ' + _.inspect(name));
                }
                Assertion.addMethod('ownProperty', assertOwnProperty);
                Assertion.addMethod('haveOwnProperty', assertOwnProperty);
                function assertLengthChain() {
                    flag(this, 'doLength', true);
                }
                function assertLength(n, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).to.have.property('length');
                    var len = obj.length;
                    this.assert(len == n, 'expected #{this} to have a length of #{exp} but got #{act}', 'expected #{this} to not have a length of #{act}', n, len);
                }
                Assertion.addChainableMethod('length', assertLength, assertLengthChain);
                Assertion.addMethod('lengthOf', assertLength, assertLengthChain);
                Assertion.addMethod('match', function (re, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(re.exec(obj), 'expected #{this} to match ' + re, 'expected #{this} not to match ' + re);
                });
                Assertion.addMethod('string', function (str, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).is.a('string');
                    this.assert(~obj.indexOf(str), 'expected #{this} to contain ' + _.inspect(str), 'expected #{this} to not contain ' + _.inspect(str));
                });
                function assertKeys(keys) {
                    var obj = flag(this, 'object'), str, ok = true;
                    keys = keys instanceof Array ? keys : Array.prototype.slice.call(arguments);
                    if (!keys.length)
                        throw new Error('keys required');
                    var actual = Object.keys(obj), len = keys.length;
                    ok = keys.every(function (key) {
                        return ~actual.indexOf(key);
                    });
                    if (!flag(this, 'negate') && !flag(this, 'contains')) {
                        ok = ok && keys.length == actual.length;
                    }
                    if (len > 1) {
                        keys = keys.map(function (key) {
                            return _.inspect(key);
                        });
                        var last = keys.pop();
                        str = keys.join(', ') + ', and ' + last;
                    } else {
                        str = _.inspect(keys[0]);
                    }
                    str = (len > 1 ? 'keys ' : 'key ') + str;
                    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;
                    this.assert(ok, 'expected #{this} to ' + str, 'expected #{this} to not ' + str);
                }
                Assertion.addMethod('keys', assertKeys);
                Assertion.addMethod('key', assertKeys);
                function assertThrows(constructor, errMsg, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj, msg).is.a('function');
                    var thrown = false, desiredError = null, name = null, thrownError = null;
                    if (arguments.length === 0) {
                        errMsg = null;
                        constructor = null;
                    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
                        errMsg = constructor;
                        constructor = null;
                    } else if (constructor && constructor instanceof Error) {
                        desiredError = constructor;
                        constructor = null;
                        errMsg = null;
                    } else if (typeof constructor === 'function') {
                        name = new constructor().name;
                    } else {
                        constructor = null;
                    }
                    try {
                        obj();
                    } catch (err) {
                        if (desiredError) {
                            this.assert(err === desiredError, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}', desiredError, err);
                            return this;
                        }
                        if (constructor) {
                            this.assert(err instanceof constructor, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp} but #{act} was thrown', name, err);
                            if (!errMsg)
                                return this;
                        }
                        var message = 'object' === _.type(err) && 'message' in err ? err.message : '' + err;
                        if (message != null && errMsg && errMsg instanceof RegExp) {
                            this.assert(errMsg.exec(message), 'expected #{this} to throw error matching #{exp} but got #{act}', 'expected #{this} to throw error not matching #{exp}', errMsg, message);
                            return this;
                        } else if (message != null && errMsg && 'string' === typeof errMsg) {
                            this.assert(~message.indexOf(errMsg), 'expected #{this} to throw error including #{exp} but got #{act}', 'expected #{this} to throw error not including #{act}', errMsg, message);
                            return this;
                        } else {
                            thrown = true;
                            thrownError = err;
                        }
                    }
                    var actuallyGot = '', expectedThrown = name !== null ? name : desiredError ? '#{exp}' : 'an error';
                    if (thrown) {
                        actuallyGot = ' but #{act} was thrown';
                    }
                    this.assert(thrown === true, 'expected #{this} to throw ' + expectedThrown + actuallyGot, 'expected #{this} to not throw ' + expectedThrown + actuallyGot, desiredError, thrownError);
                }
                ;
                Assertion.addMethod('throw', assertThrows);
                Assertion.addMethod('throws', assertThrows);
                Assertion.addMethod('Throw', assertThrows);
                Assertion.addMethod('respondTo', function (method, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object'), itself = flag(this, 'itself'), context = 'function' === _.type(obj) && !itself ? obj.prototype[method] : obj[method];
                    this.assert('function' === typeof context, 'expected #{this} to respond to ' + _.inspect(method), 'expected #{this} to not respond to ' + _.inspect(method));
                });
                Assertion.addProperty('itself', function () {
                    flag(this, 'itself', true);
                });
                Assertion.addMethod('satisfy', function (matcher, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(matcher(obj), 'expected #{this} to satisfy ' + _.objDisplay(matcher), 'expected #{this} to not satisfy' + _.objDisplay(matcher), this.negate ? false : true, matcher(obj));
                });
                Assertion.addMethod('closeTo', function (expected, delta, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    this.assert(Math.abs(obj - expected) <= delta, 'expected #{this} to be close to ' + expected + ' +/- ' + delta, 'expected #{this} not to be close to ' + expected + ' +/- ' + delta);
                });
                function isSubsetOf(subset, superset) {
                    return subset.every(function (elem) {
                        return superset.indexOf(elem) !== -1;
                    });
                }
                Assertion.addMethod('members', function (subset, msg) {
                    if (msg)
                        flag(this, 'message', msg);
                    var obj = flag(this, 'object');
                    new Assertion(obj).to.be.an('array');
                    new Assertion(subset).to.be.an('array');
                    if (flag(this, 'contains')) {
                        return this.assert(isSubsetOf(subset, obj), 'expected #{this} to be a superset of #{act}', 'expected #{this} to not be a superset of #{act}', obj, subset);
                    }
                    this.assert(isSubsetOf(obj, subset) && isSubsetOf(subset, obj), 'expected #{this} to have the same members as #{act}', 'expected #{this} to not have the same members as #{act}', obj, subset);
                });
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                var Assertion = chai.Assertion, flag = util.flag;
                var assert = chai.assert = function (express, errmsg) {
                        var test = new Assertion(null);
                        test.assert(express, errmsg, '[ negation message unavailable ]');
                    };
                assert.fail = function (actual, expected, message, operator) {
                    throw new chai.AssertionError({
                        actual: actual,
                        expected: expected,
                        message: message,
                        operator: operator,
                        stackStartFunction: assert.fail
                    });
                };
                assert.ok = function (val, msg) {
                    new Assertion(val, msg).is.ok;
                };
                assert.notOk = function (val, msg) {
                    new Assertion(val, msg).is.not.ok;
                };
                assert.equal = function (act, exp, msg) {
                    var test = new Assertion(act, msg);
                    test.assert(exp == flag(test, 'object'), 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{act}', exp, act);
                };
                assert.notEqual = function (act, exp, msg) {
                    var test = new Assertion(act, msg);
                    test.assert(exp != flag(test, 'object'), 'expected #{this} to not equal #{exp}', 'expected #{this} to equal #{act}', exp, act);
                };
                assert.strictEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.equal(exp);
                };
                assert.notStrictEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.not.equal(exp);
                };
                assert.deepEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.eql(exp);
                };
                assert.notDeepEqual = function (act, exp, msg) {
                    new Assertion(act, msg).to.not.eql(exp);
                };
                assert.isTrue = function (val, msg) {
                    new Assertion(val, msg).is['true'];
                };
                assert.isFalse = function (val, msg) {
                    new Assertion(val, msg).is['false'];
                };
                assert.isNull = function (val, msg) {
                    new Assertion(val, msg).to.equal(null);
                };
                assert.isNotNull = function (val, msg) {
                    new Assertion(val, msg).to.not.equal(null);
                };
                assert.isUndefined = function (val, msg) {
                    new Assertion(val, msg).to.equal(undefined);
                };
                assert.isDefined = function (val, msg) {
                    new Assertion(val, msg).to.not.equal(undefined);
                };
                assert.isFunction = function (val, msg) {
                    new Assertion(val, msg).to.be.a('function');
                };
                assert.isNotFunction = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('function');
                };
                assert.isObject = function (val, msg) {
                    new Assertion(val, msg).to.be.a('object');
                };
                assert.isNotObject = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('object');
                };
                assert.isArray = function (val, msg) {
                    new Assertion(val, msg).to.be.an('array');
                };
                assert.isNotArray = function (val, msg) {
                    new Assertion(val, msg).to.not.be.an('array');
                };
                assert.isString = function (val, msg) {
                    new Assertion(val, msg).to.be.a('string');
                };
                assert.isNotString = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('string');
                };
                assert.isNumber = function (val, msg) {
                    new Assertion(val, msg).to.be.a('number');
                };
                assert.isNotNumber = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('number');
                };
                assert.isBoolean = function (val, msg) {
                    new Assertion(val, msg).to.be.a('boolean');
                };
                assert.isNotBoolean = function (val, msg) {
                    new Assertion(val, msg).to.not.be.a('boolean');
                };
                assert.typeOf = function (val, type, msg) {
                    new Assertion(val, msg).to.be.a(type);
                };
                assert.notTypeOf = function (val, type, msg) {
                    new Assertion(val, msg).to.not.be.a(type);
                };
                assert.instanceOf = function (val, type, msg) {
                    new Assertion(val, msg).to.be.instanceOf(type);
                };
                assert.notInstanceOf = function (val, type, msg) {
                    new Assertion(val, msg).to.not.be.instanceOf(type);
                };
                assert.include = function (exp, inc, msg) {
                    var obj = new Assertion(exp, msg);
                    if (Array.isArray(exp)) {
                        obj.to.include(inc);
                    } else if ('string' === typeof exp) {
                        obj.to.contain.string(inc);
                    } else {
                        throw new chai.AssertionError('expected an array or string', null, assert.include);
                    }
                };
                assert.notInclude = function (exp, inc, msg) {
                    var obj = new Assertion(exp, msg);
                    if (Array.isArray(exp)) {
                        obj.to.not.include(inc);
                    } else if ('string' === typeof exp) {
                        obj.to.not.contain.string(inc);
                    } else {
                        throw new chai.AssertionError('expected an array or string', null, assert.notInclude);
                    }
                };
                assert.match = function (exp, re, msg) {
                    new Assertion(exp, msg).to.match(re);
                };
                assert.notMatch = function (exp, re, msg) {
                    new Assertion(exp, msg).to.not.match(re);
                };
                assert.property = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.have.property(prop);
                };
                assert.notProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.not.have.property(prop);
                };
                assert.deepProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.have.deep.property(prop);
                };
                assert.notDeepProperty = function (obj, prop, msg) {
                    new Assertion(obj, msg).to.not.have.deep.property(prop);
                };
                assert.propertyVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.have.property(prop, val);
                };
                assert.propertyNotVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.not.have.property(prop, val);
                };
                assert.deepPropertyVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.have.deep.property(prop, val);
                };
                assert.deepPropertyNotVal = function (obj, prop, val, msg) {
                    new Assertion(obj, msg).to.not.have.deep.property(prop, val);
                };
                assert.lengthOf = function (exp, len, msg) {
                    new Assertion(exp, msg).to.have.length(len);
                };
                assert.Throw = function (fn, errt, errs, msg) {
                    if ('string' === typeof errt || errt instanceof RegExp) {
                        errs = errt;
                        errt = null;
                    }
                    new Assertion(fn, msg).to.Throw(errt, errs);
                };
                assert.doesNotThrow = function (fn, type, msg) {
                    if ('string' === typeof type) {
                        msg = type;
                        type = null;
                    }
                    new Assertion(fn, msg).to.not.Throw(type);
                };
                assert.operator = function (val, operator, val2, msg) {
                    if (!~[
                            '==',
                            '===',
                            '>',
                            '>=',
                            '<',
                            '<=',
                            '!=',
                            '!=='
                        ].indexOf(operator)) {
                        throw new Error('Invalid operator "' + operator + '"');
                    }
                    var test = new Assertion(eval(val + operator + val2), msg);
                    test.assert(true === flag(test, 'object'), 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2), 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2));
                };
                assert.closeTo = function (act, exp, delta, msg) {
                    new Assertion(act, msg).to.be.closeTo(exp, delta);
                };
                assert.sameMembers = function (set1, set2, msg) {
                    new Assertion(set1, msg).to.have.same.members(set2);
                };
                assert.includeMembers = function (superset, subset, msg) {
                    new Assertion(superset, msg).to.include.members(subset);
                };
                assert.ifError = function (val, msg) {
                    new Assertion(val, msg).to.not.be.ok;
                };
                (function alias(name, as) {
                    assert[as] = assert[name];
                    return alias;
                }('Throw', 'throw')('Throw', 'throws'));
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                chai.expect = function (val, message) {
                    return new chai.Assertion(val, message);
                };
            };
        },
        function (module, exports) {
            module.exports = function (chai, util) {
                var Assertion = chai.Assertion;
                function loadShould() {
                    Object.defineProperty(Object.prototype, 'should', {
                        set: function (value) {
                            Object.defineProperty(this, 'should', {
                                value: value,
                                enumerable: true,
                                configurable: true,
                                writable: true
                            });
                        },
                        get: function () {
                            if (this instanceof String || this instanceof Number) {
                                return new Assertion(this.constructor(this));
                            } else if (this instanceof Boolean) {
                                return new Assertion(this == true);
                            }
                            return new Assertion(this);
                        },
                        configurable: true
                    });
                    var should = {};
                    should.equal = function (val1, val2, msg) {
                        new Assertion(val1, msg).to.equal(val2);
                    };
                    should.Throw = function (fn, errt, errs, msg) {
                        new Assertion(fn, msg).to.Throw(errt, errs);
                    };
                    should.exist = function (val, msg) {
                        new Assertion(val, msg).to.exist;
                    };
                    should.not = {};
                    should.not.equal = function (val1, val2, msg) {
                        new Assertion(val1, msg).to.not.equal(val2);
                    };
                    should.not.Throw = function (fn, errt, errs, msg) {
                        new Assertion(fn, msg).to.not.Throw(errt, errs);
                    };
                    should.not.exist = function (val, msg) {
                        new Assertion(val, msg).to.not.exist;
                    };
                    should['throw'] = should['Throw'];
                    should.not['throw'] = should.not['Throw'];
                    return should;
                }
                ;
                chai.should = loadShould;
                chai.Should = loadShould;
            };
        },
        function (module, exports) {
            var exports = module.exports = {};
            exports.test = _require(23);
            exports.type = _require(25);
            exports.getMessage = _require(15);
            exports.getActual = _require(13);
            exports.inspect = _require(19);
            exports.objDisplay = _require(20);
            exports.flag = _require(12);
            exports.transferFlags = _require(24);
            exports.eql = _require(27);
            exports.getPathValue = _require(17);
            exports.getName = _require(16);
            exports.addProperty = _require(11);
            exports.addMethod = _require(10);
            exports.overwriteProperty = _require(22);
            exports.overwriteMethod = _require(21);
            exports.addChainableMethod = _require(9);
        },
        function (module, exports) {
            var transferFlags = _require(24);
            var hasProtoSupport = '__proto__' in Object;
            var excludeNames = /^(?:length|name|arguments|caller)$/;
            var call = Function.prototype.call, apply = Function.prototype.apply;
            module.exports = function (ctx, name, method, chainingBehavior) {
                if (typeof chainingBehavior !== 'function')
                    chainingBehavior = function () {
                    };
                Object.defineProperty(ctx, name, {
                    get: function () {
                        chainingBehavior.call(this);
                        var assert = function () {
                            var result = method.apply(this, arguments);
                            return result === undefined ? this : result;
                        };
                        if (hasProtoSupport) {
                            var prototype = assert.__proto__ = Object.create(this);
                            prototype.call = call;
                            prototype.apply = apply;
                        } else {
                            var asserterNames = Object.getOwnPropertyNames(ctx);
                            asserterNames.forEach(function (asserterName) {
                                if (!excludeNames.test(asserterName)) {
                                    var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
                                    Object.defineProperty(assert, asserterName, pd);
                                }
                            });
                        }
                        transferFlags(this, assert);
                        return assert;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, method) {
                ctx[name] = function () {
                    var result = method.apply(this, arguments);
                    return result === undefined ? this : result;
                };
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, getter) {
                Object.defineProperty(ctx, name, {
                    get: function () {
                        var result = getter.call(this);
                        return result === undefined ? this : result;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            module.exports = function (obj, key, value) {
                var flags = obj.__flags || (obj.__flags = Object.create(null));
                if (arguments.length === 3) {
                    flags[key] = value;
                } else {
                    return flags[key];
                }
            };
        },
        function (module, exports) {
            module.exports = function (obj, args) {
                var actual = args[4];
                return 'undefined' !== typeof actual ? actual : obj._obj;
            };
        },
        function (module, exports) {
            module.exports = function getEnumerableProperties(object) {
                var result = [];
                for (var name in object) {
                    result.push(name);
                }
                return result;
            };
        },
        function (module, exports) {
            var flag = _require(12), getActual = _require(13), inspect = _require(19), objDisplay = _require(20);
            module.exports = function (obj, args) {
                var negate = flag(obj, 'negate'), val = flag(obj, 'object'), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, 'message');
                msg = msg || '';
                msg = msg.replace(/#{this}/g, objDisplay(val)).replace(/#{act}/g, objDisplay(actual)).replace(/#{exp}/g, objDisplay(expected));
                return flagMsg ? flagMsg + ': ' + msg : msg;
            };
        },
        function (module, exports) {
            module.exports = function (func) {
                if (func.name)
                    return func.name;
                var match = /^\s?function ([^(]*)\(/.exec(func);
                return match && match[1] ? match[1] : '';
            };
        },
        function (module, exports) {
            var getPathValue = module.exports = function (path, obj) {
                    var parsed = parsePath(path);
                    return _getPathValue(parsed, obj);
                };
            function parsePath(path) {
                var str = path.replace(/\[/g, '.['), parts = str.match(/(\\\.|[^.]+?)+/g);
                return parts.map(function (value) {
                    var re = /\[(\d+)\]$/, mArr = re.exec(value);
                    if (mArr)
                        return { i: parseFloat(mArr[1]) };
                    else
                        return { p: value };
                });
            }
            ;
            function _getPathValue(parsed, obj) {
                var tmp = obj, res;
                for (var i = 0, l = parsed.length; i < l; i++) {
                    var part = parsed[i];
                    if (tmp) {
                        if ('undefined' !== typeof part.p)
                            tmp = tmp[part.p];
                        else if ('undefined' !== typeof part.i)
                            tmp = tmp[part.i];
                        if (i == l - 1)
                            res = tmp;
                    } else {
                        res = undefined;
                    }
                }
                return res;
            }
            ;
        },
        function (module, exports) {
            module.exports = function getProperties(object) {
                var result = Object.getOwnPropertyNames(subject);
                function addProperty(property) {
                    if (result.indexOf(property) === -1) {
                        result.push(property);
                    }
                }
                var proto = Object.getPrototypeOf(subject);
                while (proto !== null) {
                    Object.getOwnPropertyNames(proto).forEach(addProperty);
                    proto = Object.getPrototypeOf(proto);
                }
                return result;
            };
        },
        function (module, exports) {
            var getName = _require(16);
            var getProperties = _require(18);
            var getEnumerableProperties = _require(14);
            module.exports = inspect;
            function inspect(obj, showHidden, depth, colors) {
                var ctx = {
                        showHidden: showHidden,
                        seen: [],
                        stylize: function (str) {
                            return str;
                        }
                    };
                return formatValue(ctx, obj, typeof depth === 'undefined' ? 2 : depth);
            }
            var getOuterHTML = function (element) {
                if ('outerHTML' in element)
                    return element.outerHTML;
                var ns = 'http://www.w3.org/1999/xhtml';
                var container = document.createElementNS(ns, '_');
                var elemProto = (window.HTMLElement || window.Element).prototype;
                var xmlSerializer = new XMLSerializer();
                var html;
                if (document.xmlVersion) {
                    return xmlSerializer.serializeToString(element);
                } else {
                    container.appendChild(element.cloneNode(false));
                    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
                    container.innerHTML = '';
                    return html;
                }
            };
            var isDOMElement = function (object) {
                if (typeof HTMLElement === 'object') {
                    return object instanceof HTMLElement;
                } else {
                    return object && typeof object === 'object' && object.nodeType === 1 && typeof object.nodeName === 'string';
                }
            };
            function formatValue(ctx, value, recurseTimes) {
                if (value && typeof value.inspect === 'function' && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
                    var ret = value.inspect(recurseTimes);
                    if (typeof ret !== 'string') {
                        ret = formatValue(ctx, ret, recurseTimes);
                    }
                    return ret;
                }
                var primitive = formatPrimitive(ctx, value);
                if (primitive) {
                    return primitive;
                }
                if (isDOMElement(value)) {
                    return getOuterHTML(value);
                }
                var visibleKeys = getEnumerableProperties(value);
                var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
                if (keys.length === 0 || isError(value) && (keys.length === 1 && keys[0] === 'stack' || keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')) {
                    if (typeof value === 'function') {
                        var name = getName(value);
                        var nameSuffix = name ? ': ' + name : '';
                        return ctx.stylize('[Function' + nameSuffix + ']', 'special');
                    }
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    }
                    if (isDate(value)) {
                        return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
                    }
                    if (isError(value)) {
                        return formatError(value);
                    }
                }
                var base = '', array = false, braces = [
                        '{',
                        '}'
                    ];
                if (isArray(value)) {
                    array = true;
                    braces = [
                        '[',
                        ']'
                    ];
                }
                if (typeof value === 'function') {
                    var name = getName(value);
                    var nameSuffix = name ? ': ' + name : '';
                    base = ' [Function' + nameSuffix + ']';
                }
                if (isRegExp(value)) {
                    base = ' ' + RegExp.prototype.toString.call(value);
                }
                if (isDate(value)) {
                    base = ' ' + Date.prototype.toUTCString.call(value);
                }
                if (isError(value)) {
                    return formatError(value);
                }
                if (keys.length === 0 && (!array || value.length == 0)) {
                    return braces[0] + base + braces[1];
                }
                if (recurseTimes < 0) {
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    } else {
                        return ctx.stylize('[Object]', 'special');
                    }
                }
                ctx.seen.push(value);
                var output;
                if (array) {
                    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                } else {
                    output = keys.map(function (key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    });
                }
                ctx.seen.pop();
                return reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
                switch (typeof value) {
                case 'undefined':
                    return ctx.stylize('undefined', 'undefined');
                case 'string':
                    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, '\\\'').replace(/\\"/g, '"') + '\'';
                    return ctx.stylize(simple, 'string');
                case 'number':
                    return ctx.stylize('' + value, 'number');
                case 'boolean':
                    return ctx.stylize('' + value, 'boolean');
                }
                if (value === null) {
                    return ctx.stylize('null', 'null');
                }
            }
            function formatError(value) {
                return '[' + Error.prototype.toString.call(value) + ']';
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                var output = [];
                for (var i = 0, l = value.length; i < l; ++i) {
                    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
                    } else {
                        output.push('');
                    }
                }
                keys.forEach(function (key) {
                    if (!key.match(/^\d+$/)) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
                    }
                });
                return output;
            }
            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str;
                if (value.__lookupGetter__) {
                    if (value.__lookupGetter__(key)) {
                        if (value.__lookupSetter__(key)) {
                            str = ctx.stylize('[Getter/Setter]', 'special');
                        } else {
                            str = ctx.stylize('[Getter]', 'special');
                        }
                    } else {
                        if (value.__lookupSetter__(key)) {
                            str = ctx.stylize('[Setter]', 'special');
                        }
                    }
                }
                if (visibleKeys.indexOf(key) < 0) {
                    name = '[' + key + ']';
                }
                if (!str) {
                    if (ctx.seen.indexOf(value[key]) < 0) {
                        if (recurseTimes === null) {
                            str = formatValue(ctx, value[key], null);
                        } else {
                            str = formatValue(ctx, value[key], recurseTimes - 1);
                        }
                        if (str.indexOf('\n') > -1) {
                            if (array) {
                                str = str.split('\n').map(function (line) {
                                    return '  ' + line;
                                }).join('\n').substr(2);
                            } else {
                                str = '\n' + str.split('\n').map(function (line) {
                                    return '   ' + line;
                                }).join('\n');
                            }
                        }
                    } else {
                        str = ctx.stylize('[Circular]', 'special');
                    }
                }
                if (typeof name === 'undefined') {
                    if (array && key.match(/^\d+$/)) {
                        return str;
                    }
                    name = JSON.stringify('' + key);
                    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        name = name.substr(1, name.length - 2);
                        name = ctx.stylize(name, 'name');
                    } else {
                        name = name.replace(/'/g, '\\\'').replace(/\\"/g, '"').replace(/(^"|"$)/g, '\'');
                        name = ctx.stylize(name, 'string');
                    }
                }
                return name + ': ' + str;
            }
            function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0;
                var length = output.reduce(function (prev, cur) {
                        numLinesEst++;
                        if (cur.indexOf('\n') >= 0)
                            numLinesEst++;
                        return prev + cur.length + 1;
                    }, 0);
                if (length > 60) {
                    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
                }
                return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
            }
            function isArray(ar) {
                return Array.isArray(ar) || typeof ar === 'object' && objectToString(ar) === '[object Array]';
            }
            function isRegExp(re) {
                return typeof re === 'object' && objectToString(re) === '[object RegExp]';
            }
            function isDate(d) {
                return typeof d === 'object' && objectToString(d) === '[object Date]';
            }
            function isError(e) {
                return typeof e === 'object' && objectToString(e) === '[object Error]';
            }
            function objectToString(o) {
                return Object.prototype.toString.call(o);
            }
        },
        function (module, exports) {
            var inspect = _require(19);
            module.exports = function (obj) {
                var str = inspect(obj), type = Object.prototype.toString.call(obj);
                if (str.length >= 40) {
                    if (type === '[object Function]') {
                        return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
                    } else if (type === '[object Array]') {
                        return '[ Array(' + obj.length + ') ]';
                    } else if (type === '[object Object]') {
                        var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
                        return '{ Object (' + kstr + ') }';
                    } else {
                        return str;
                    }
                } else {
                    return str;
                }
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, method) {
                var _method = ctx[name], _super = function () {
                        return this;
                    };
                if (_method && 'function' === typeof _method)
                    _super = _method;
                ctx[name] = function () {
                    var result = method(_super).apply(this, arguments);
                    return result === undefined ? this : result;
                };
            };
        },
        function (module, exports) {
            module.exports = function (ctx, name, getter) {
                var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function () {
                    };
                if (_get && 'function' === typeof _get.get)
                    _super = _get.get;
                Object.defineProperty(ctx, name, {
                    get: function () {
                        var result = getter(_super).call(this);
                        return result === undefined ? this : result;
                    },
                    configurable: true
                });
            };
        },
        function (module, exports) {
            var flag = _require(12);
            module.exports = function (obj, args) {
                var negate = flag(obj, 'negate'), expr = args[0];
                return negate ? !expr : expr;
            };
        },
        function (module, exports) {
            module.exports = function (assertion, object, includeAll) {
                var flags = assertion.__flags || (assertion.__flags = Object.create(null));
                if (!object.__flags) {
                    object.__flags = Object.create(null);
                }
                includeAll = arguments.length === 3 ? includeAll : true;
                for (var flag in flags) {
                    if (includeAll || flag !== 'object' && flag !== 'ssfi' && flag != 'message') {
                        object.__flags[flag] = flags[flag];
                    }
                }
            };
        },
        function (module, exports) {
            var natives = {
                    '[object Arguments]': 'arguments',
                    '[object Array]': 'array',
                    '[object Date]': 'date',
                    '[object Function]': 'function',
                    '[object Number]': 'number',
                    '[object RegExp]': 'regexp',
                    '[object String]': 'string'
                };
            module.exports = function (obj) {
                var str = Object.prototype.toString.call(obj);
                if (natives[str])
                    return natives[str];
                if (obj === null)
                    return 'null';
                if (obj === undefined)
                    return 'undefined';
                if (obj === Object(obj))
                    return 'object';
                return typeof obj;
            };
        },
        function (module, exports) {
            function exclude() {
                var excludes = [].slice.call(arguments);
                function excludeProps(res, obj) {
                    Object.keys(obj).forEach(function (key) {
                        if (!~excludes.indexOf(key))
                            res[key] = obj[key];
                    });
                }
                return function extendExclude() {
                    var args = [].slice.call(arguments), i = 0, res = {};
                    for (; i < args.length; i++) {
                        excludeProps(res, args[i]);
                    }
                    return res;
                };
            }
            ;
            module.exports = AssertionError;
            function AssertionError(message, _props, ssf) {
                var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON'), props = extend(_props || {});
                this.message = message || 'Unspecified AssertionError';
                this.showDiff = false;
                for (var key in props) {
                    this[key] = props[key];
                }
                ssf = ssf || arguments.callee;
                if (ssf && Error.captureStackTrace) {
                    Error.captureStackTrace(this, ssf);
                }
            }
            AssertionError.prototype = Object.create(Error.prototype);
            AssertionError.prototype.name = 'AssertionError';
            AssertionError.prototype.constructor = AssertionError;
            AssertionError.prototype.toJSON = function (stack) {
                var extend = exclude('constructor', 'toJSON', 'stack'), props = extend({ name: this.name }, this);
                if (false !== stack && this.stack) {
                    props.stack = this.stack;
                }
                return props;
            };
        },
        function (module, exports) {
            module.exports = _require(28);
        },
        function (module, exports) {
            var type = _require(29);
            var Buffer;
            try {
                Buffer = require('buffer').Buffer;
            } catch (ex) {
                Buffer = {};
                Buffer.isBuffer = function () {
                    return false;
                };
            }
            module.exports = deepEqual;
            function deepEqual(a, b, m) {
                if (sameValue(a, b)) {
                    return true;
                } else if ('date' === type(a)) {
                    return dateEqual(a, b);
                } else if ('regexp' === type(a)) {
                    return regexpEqual(a, b);
                } else if (Buffer.isBuffer(a)) {
                    return bufferEqual(a, b);
                } else if ('arguments' === type(a)) {
                    return argumentsEqual(a, b, m);
                } else if (!typeEqual(a, b)) {
                    return false;
                } else if ('object' !== type(a) && 'object' !== type(b) && ('array' !== type(a) && 'array' !== type(b))) {
                    return sameValue(a, b);
                } else {
                    return objectEqual(a, b, m);
                }
            }
            function sameValue(a, b) {
                if (a === b)
                    return a !== 0 || 1 / a === 1 / b;
                return a !== a && b !== b;
            }
            function typeEqual(a, b) {
                return type(a) === type(b);
            }
            function dateEqual(a, b) {
                if ('date' !== type(b))
                    return false;
                return sameValue(a.getTime(), b.getTime());
            }
            function regexpEqual(a, b) {
                if ('regexp' !== type(b))
                    return false;
                return sameValue(a.toString(), b.toString());
            }
            function argumentsEqual(a, b, m) {
                if ('arguments' !== type(b))
                    return false;
                a = [].slice.call(a);
                b = [].slice.call(b);
                return deepEqual(a, b, m);
            }
            function enumerable(a) {
                var res = [];
                for (var key in a)
                    res.push(key);
                return res;
            }
            function iterableEqual(a, b) {
                if (a.length !== b.length)
                    return false;
                var i = 0;
                var match = true;
                for (; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        match = false;
                        break;
                    }
                }
                return match;
            }
            function bufferEqual(a, b) {
                if (!Buffer.isBuffer(b))
                    return false;
                return iterableEqual(a, b);
            }
            function isValue(a) {
                return a !== null && a !== undefined;
            }
            function objectEqual(a, b, m) {
                if (!isValue(a) || !isValue(b)) {
                    return false;
                }
                if (a.prototype !== b.prototype) {
                    return false;
                }
                var i;
                if (m) {
                    for (i = 0; i < m.length; i++) {
                        if (m[i][0] === a && m[i][1] === b || m[i][0] === b && m[i][1] === a) {
                            return true;
                        }
                    }
                } else {
                    m = [];
                }
                try {
                    var ka = enumerable(a);
                    var kb = enumerable(b);
                } catch (ex) {
                    return false;
                }
                ka.sort();
                kb.sort();
                if (!iterableEqual(ka, kb)) {
                    return false;
                }
                m.push([
                    a,
                    b
                ]);
                var key;
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!deepEqual(a[key], b[key], m)) {
                        return false;
                    }
                }
                return true;
            }
        },
        function (module, exports) {
            module.exports = _require(30);
        },
        function (module, exports) {
            var exports = module.exports = getType;
            var natives = {
                    '[object Array]': 'array',
                    '[object RegExp]': 'regexp',
                    '[object Function]': 'function',
                    '[object Arguments]': 'arguments',
                    '[object Date]': 'date'
                };
            function getType(obj) {
                var str = Object.prototype.toString.call(obj);
                if (natives[str])
                    return natives[str];
                if (obj === null)
                    return 'null';
                if (obj === undefined)
                    return 'undefined';
                if (obj === Object(obj))
                    return 'object';
                return typeof obj;
            }
            exports.Library = Library;
            function Library() {
                this.tests = {};
            }
            Library.prototype.of = getType;
            Library.prototype.define = function (type, test) {
                if (arguments.length === 1)
                    return this.tests[type];
                this.tests[type] = test;
                return this;
            };
            Library.prototype.test = function (obj, type) {
                if (type === getType(obj))
                    return true;
                var test = this.tests[type];
                if (test && 'regexp' === getType(test)) {
                    return test.test(obj);
                } else if (test && 'function' === getType(test)) {
                    return test(obj);
                } else {
                    throw new ReferenceError('Type test "' + type + '" not defined or invalid.');
                }
            };
        },
        function (module, exports) {
            'use strict';
            var concat = [].concat;
            var slice = [].slice;
            module.exports = function curry(fn, thisContext) {
                var arity = fn.length;
                function curryCall() {
                    var args = slice.call(arguments);
                    if (args.length == arity) {
                        return fn.apply(thisContext, args);
                    }
                    if (args.length < arity) {
                        return function () {
                            var allArgs = concat.apply(args, arguments);
                            return curryCall.apply(null, allArgs);
                        };
                    }
                    throw new Error('Too many arguments supplied.');
                }
                return curryCall;
            };
        },
        function (module, exports) {
            _require(33);
            _require(34);
            _require(35);
            _require(36);
        },
        function (module, exports) {
            'use strict';
            var chai = _require(1);
            chai.expect();
            var should = chai.should();
            var requestyPath = '../lib/requesty';
            var requesty;
            if (typeof window === 'undefined') {
                requesty = require(requestyPath);
            } else {
                requesty = window.requesty;
            }
            var httpbin = process.env.httpbin || 'http://httpbin.org';
            function newApi() {
                var req = requesty.new().usePromises();
                req.get().using(httpbin).headers({ 'User-Agent': 'requesty' });
                return {
                    getJson: req.using({ path: '/get' }).build(),
                    gzipped: req.using({ path: '/gzip' }).build(),
                    redirect: req.using({ path: '/redirect/1' }).build(),
                    notFound: req.using({ path: '/status/404' }).build(),
                    status201: req.using({ path: '/status/201' }).build(),
                    postJson: req.post().using({ path: '/post' }).build()
                };
            }
            describe('requesty build an api', function () {
                this.timeout(100000);
                var api = newApi();
                describe('GET https json', function () {
                    var response;
                    before(function (done) {
                        api.getJson().then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('parse json', function () {
                        response.data.should.be.an('object');
                    });
                    it('parse headers', function () {
                        response.headers['content-type'].should.be.equal('application/json');
                    });
                });
                describe('POST http json', function () {
                    var response;
                    before(function (done) {
                        api.postJson('Just a test').then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('post request body', function () {
                        response.data.data.should.be.equal('Just a test');
                    });
                });
                describe('GET gzipped data', function () {
                    var response;
                    before(function (done) {
                        api.gzipped().then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('return unzipped json data', function () {
                        response.data.should.be.an('object');
                    });
                    it('parse headers', function () {
                        response.data.gzipped.should.be.equal(true);
                    });
                });
                describe('follow redirects', function () {
                    var response;
                    before(function (done) {
                        api.redirect().then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('return json data from redirected page', function () {
                        response.data.should.be.an('object');
                        response.data.url.should.be.equal(httpbin + '/get');
                    });
                });
                describe('GET http  404', function () {
                    var error;
                    before(function (done) {
                        api.notFound().return().then(done).catch(function (err) {
                            error = err;
                            done();
                        });
                    });
                    it('reject with error', function () {
                        error.should.be.an('object');
                    });
                    it('error message contains status code and description', function () {
                        error.message.should.be.equal('404: Not Found');
                    });
                    it('error contains status code', function () {
                        error.statusCode.should.be.equal(404);
                    });
                });
                describe('succeed with status 2**', function () {
                    var error;
                    var response;
                    before(function (done) {
                        api.status201().then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('fullfill response', function () {
                        response.headers['content-type'].should.be.equal('text/html; charset=utf-8');
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(1);
            chai.expect();
            var should = chai.should();
            var requestyPath = '../lib/requesty';
            var requesty;
            if (typeof window === 'undefined') {
                requesty = require(requestyPath);
            } else {
                requesty = window.requesty;
            }
            var httpbin = process.env.httpbin || 'http://httpbin.org';
            describe('requesty core request', function () {
                this.timeout(100000);
                it('is defined', function () {
                    requesty.should.be.an('function');
                });
                describe('GET https json', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/get', 'GET', { 'User-Agent': 'requesty' });
                        req.then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('parse json', function () {
                        response.data.should.be.an('object');
                    });
                    it('parse headers', function () {
                        response.headers['content-type'].should.be.equal('application/json');
                    });
                });
                describe('GET http json', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/get', 'GET', { 'User-Agent': 'requesty' });
                        req.then(function (res) {
                            response = res;
                            done();
                        }).catch(done);
                    });
                    it('parse json', function () {
                        response.data.should.be.an('object');
                    });
                    it('parse headers', function () {
                        response.headers['content-type'].should.be.equal('application/json');
                    });
                });
                describe('POST http json', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/post', 'POST', {}, 'Just a test');
                        req.then(function (res) {
                            response = res;
                            done();
                        }).then(null, done);
                    });
                    it('post request body', function () {
                        response.data.data.should.be.equal('Just a test');
                    });
                });
                describe('POST http unicode', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/post', 'POST', {}, 'Just a \u20AC');
                        req.then(function (res) {
                            response = res;
                            done();
                        }).then(null, done);
                    });
                    it('post request body', function () {
                        response.data.data.should.be.equal('Just a \u20AC');
                    });
                });
                describe('GET gzipped data', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/gzip');
                        req.then(function (res) {
                            response = res;
                            done();
                        }).then(null, done);
                    });
                    it('return unzipped json data', function () {
                        response.data.should.be.an('object');
                    });
                    it('parse headers', function () {
                        response.data.gzipped.should.be.equal(true);
                    });
                });
                describe('follow redirects', function () {
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/redirect/1');
                        req.then(function (res) {
                            response = res;
                            done();
                        }).then(null, done);
                    });
                    it('return json data from redirected page', function () {
                        response.data.should.be.an('object');
                        response.data.url.should.be.equal(httpbin + '/get');
                    });
                });
                describe('GET http  404', function () {
                    var error;
                    before(function (done) {
                        var req = requesty(httpbin + '/status/404', 'GET');
                        req.then(function () {
                            done();
                        }).catch(function (err) {
                            error = err;
                            done();
                        });
                    });
                    it('reject with error', function () {
                        error.should.be.an('object');
                    });
                    it('error message contains status code and description', function () {
                        error.message.should.be.equal('404: Not Found');
                    });
                    it('error contains status code', function () {
                        error.statusCode.should.be.equal(404);
                    });
                });
                describe('GET http 500', function () {
                    var error;
                    before(function (done) {
                        var req = requesty(httpbin + '/status/500', 'GET');
                        req.then(function () {
                            done();
                        }).catch(function (err) {
                            error = err;
                            done();
                        });
                    });
                    it('reject with error', function () {
                        error.should.be.an('object');
                    });
                    it('error message contains status code and description', function () {
                        error.message.should.be.equal('500: Internal Server Error');
                    });
                    it('error contains status code', function () {
                        error.statusCode.should.be.equal(500);
                    });
                });
                describe('succeed with status 2**', function () {
                    var error;
                    var response;
                    before(function (done) {
                        var req = requesty(httpbin + '/status/201');
                        req.then(function (res) {
                            response = res;
                            done();
                        }).catch(function (err) {
                            error = err;
                            done();
                        });
                    });
                    it('error is not raised', function () {
                        should.equal(error, undefined);
                    });
                    it('fullfill response', function () {
                        response.headers['content-type'].should.be.equal('text/html; charset=utf-8');
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(1);
            chai.expect();
            var should = chai.should();
            var requestyPath = '../lib/requesty';
            var requesty;
            if (typeof window === 'undefined') {
                requesty = require(requestyPath);
            } else {
                requesty = window.requesty;
            }
            var httpbin = process.env.httpbin || 'http://httpbin.org';
            describe('requesty', function () {
                this.timeout(10000);
                it('is defined', function () {
                    requesty.should.be.an('function');
                });
                describe('return', function () {
                    it('promises', function (done) {
                        var req = requesty.new();
                        var getHttpBin = req.get(httpbin + '/html');
                        req.send().then(function (res) {
                            res.data.indexOf('Herman Melville - Moby-Dick').should.be.greaterThan(10);
                            done();
                        }).then(null, done);
                    });
                    it('callbacks', function (done) {
                        var req = requesty.new();
                        var getHttpBin = req.get(httpbin + '/html');
                        req.useCallbacks().send(function success(err, res) {
                            if (err) {
                                return done(err);
                            }
                            res.data.indexOf('Herman Melville - Moby-Dick').should.be.greaterThan(10);
                            done();
                        });
                    });
                });
                describe('new', function () {
                    var req = requesty.new({ its: 'me' });
                    var reqDefault = requesty.new();
                    it('return new Request object', function () {
                        (reqDefault instanceof requesty.Request).should.be.equal(true);
                    });
                    it('accept options object', function () {
                        req.options.its.should.be.equal('me');
                    });
                    it('options created by default', function () {
                        reqDefault.options.should.be.a('object');
                    });
                });
                describe('serving results', function () {
                    var req = requesty.new();
                    it('return promises as default', function () {
                        req.options.mode.should.equal('promises');
                    });
                    it('use callback', function () {
                        req.useCallbacks();
                        req.options.mode.should.equal('callbacks');
                    });
                    it('use streams', function () {
                        req.useStreams();
                        req.options.mode.should.equal('streams');
                    });
                });
                describe('method', function () {
                    var req = requesty.new();
                    describe('auth', function () {
                        var authResult = req.auth('usern@me', 'p@ssword');
                        var withOptions = requesty.new().auth({
                                user: 'usern@me',
                                password: 'p@ssword'
                            });
                        it('return req instance for fluid api chain', function () {
                            authResult.should.be.equal(req);
                        });
                        it('save user in options', function () {
                            authResult.options.auth.user.should.be.equal('usern@me');
                        });
                        it('save password in options', function () {
                            authResult.options.auth.password.should.be.equal('p@ssword');
                        });
                        it('has a default type of basic', function () {
                            authResult.options.auth.type.should.be.equal('basic');
                        });
                        describe('with options', function () {
                            it('save user in options', function () {
                                withOptions.options.auth.user.should.be.equal('usern@me');
                            });
                            it('save password in options', function () {
                                withOptions.options.auth.password.should.be.equal('p@ssword');
                            });
                            it('has a default type of basic', function () {
                                withOptions.options.auth.type.should.be.equal('basic');
                            });
                        });
                    });
                    describe('get', function () {
                        var getReturn = req.get();
                        it('return req instance for fluid api chain', function () {
                            getReturn.should.be.equal(req);
                        });
                        it('same method to options', function () {
                            getReturn.options.method.should.be.equal('GET');
                        });
                    });
                    describe('using', function () {
                        var usingResult = req.using('http://localhost');
                        var withOptions = requesty.new().using({
                                scheme: 'https:',
                                hostname: 'www.parro.it',
                                port: 1000,
                                path: '/test'
                            });
                        it('return req instance for fluid api chain', function () {
                            usingResult.should.be.equal(req);
                        });
                        it('save scheme in options', function () {
                            usingResult.options.scheme.should.be.equal('http:');
                        });
                        it('save hostname in options', function () {
                            usingResult.options.hostname.should.be.equal('localhost');
                        });
                        it('has a default port of 80 for http', function () {
                            usingResult.options.port.should.be.equal(80);
                        });
                        it('has a default path of /', function () {
                            usingResult.options.path.should.be.equal('/');
                        });
                        describe('with options', function () {
                            it('save scheme in options', function () {
                                withOptions.options.scheme.should.be.equal('https:');
                            });
                            it('save hostname in options', function () {
                                withOptions.options.hostname.should.be.equal('www.parro.it');
                            });
                            it('save port of in options', function () {
                                withOptions.options.port.should.be.equal(1000);
                            });
                            it('save path in options', function () {
                                withOptions.options.path.should.be.equal('/test');
                            });
                        });
                    });
                    describe('proxy', function () {
                        var proxyResult = req.proxy('proxy.host-na.me', 'usern@me', 'p@ssword');
                        var withOptions = requesty.new().proxy({
                                hostname: 'proxy.host-na.me',
                                user: 'usern@me',
                                password: 'p@ssword'
                            });
                        it('return req instance for fluid api chain', function () {
                            proxyResult.should.be.equal(req);
                        });
                        it('save user in options', function () {
                            proxyResult.options.proxy.user.should.be.equal('usern@me');
                        });
                        it('save password in options', function () {
                            proxyResult.options.proxy.password.should.be.equal('p@ssword');
                        });
                        it('save hostname in options', function () {
                            proxyResult.options.proxy.hostname.should.be.equal('proxy.host-na.me');
                        });
                        it('has a default type of basic', function () {
                            proxyResult.options.proxy.type.should.be.equal('basic');
                        });
                        describe('with options', function () {
                            it('save user in options', function () {
                                withOptions.options.proxy.user.should.be.equal('usern@me');
                            });
                            it('save password in options', function () {
                                withOptions.options.proxy.password.should.be.equal('p@ssword');
                            });
                            it('save hostname in options', function () {
                                withOptions.options.proxy.hostname.should.be.equal('proxy.host-na.me');
                            });
                            it('has a default type of basic', function () {
                                withOptions.options.proxy.type.should.be.equal('basic');
                            });
                        });
                    });
                });
            });
        },
        function (module, exports) {
            'use strict';
            var chai = _require(1);
            chai.expect();
            var should = chai.should();
            var utils = _require(0);
            describe('utils', function () {
                it('is defined', function () {
                    utils.should.be.an('object');
                });
                describe('assign', function () {
                    var target1 = { a: 'a' };
                    var target2 = {
                            a: 'a',
                            b: 'c'
                        };
                    var results1 = utils.assign(target1, { b: 'b' });
                    var results2 = utils.assign(target2, { b: 'b' });
                    it('is defined', function () {
                        utils.assign.should.be.an('function');
                    });
                    it('return target', function () {
                        results1.should.be.equal(target1);
                    });
                    it('add source props to target', function () {
                        results1.b.should.be.equal('b');
                    });
                    it('overwrite target props', function () {
                        results2.b.should.be.equal('b');
                    });
                });
            });
        }
    ];
    _require(32);
}());