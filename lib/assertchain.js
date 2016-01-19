var _ = require("underscore");

function getAssertChain(obj, cb) {
    
    function createAssertChain(obj, cb) {
                
        function areEqual(expected, actual) {
            jasmine.currentEnv_.expect(actual).toBe(expected);
            return this;
        }
        
        function areNotEqual(expected, actual) {
            jasmine.currentEnv_.expect(actual).not.toBe(expected);
            return this;
        }
        
        function isTrue(actual) {
            jasmine.currentEnv_.expect(actual).toBe(true);
            return this;
        }
        
        function isFalse(actual) {
            jasmine.currentEnv_.expect(actual).toBe(false);
            return this;
        }
        
        function isNull(actual) {
            jasmine.currentEnv_.expect(actual).toBe(null);
            return this;
        }
        
        function isNotNull(actual) {
            jasmine.currentEnv_.expect(actual).not.toBe(null);
            return this;
        }
        
        var assertChain = {
                context: obj,
                areEqual: areEqual,
                areNotEqual: areNotEqual,
                isTrue: isTrue,
                isFalse: isFalse,
                isNull: isNull,
                isNotNull: isNotNull,
                with: getAssertChain
        };
        
        return _.extend(assertChain, module.exports.Extensions);
    }
    
    
    var chain = createAssertChain(obj);
    cb.call(chain, obj);
    return chain;
}

module.exports = {
    with: getAssertChain,
    Extensions: {}
}