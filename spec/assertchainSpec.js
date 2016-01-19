var AssertChain = require("../lib/assertchain");

var PASSED = "passed";
var FAILED = "failed";

describe("standard usage", function () {
    describe("areEqual", function () {
        it("correctly checks equality", function () {
            //Arrange
            var actual = {
                someValue: 345
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.areEqual(345, obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for inequality", function () {
            //Arrange
            var actual = {
                someValue: 345
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.areEqual(346, obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("areNotEqual", function () {
        it("correctly checks inequality", function () {
            //Arrange
            var actual = {
                someValue: 345
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.areNotEqual(346, obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for equality", function () {
            //Arrange
            var actual = {
                someValue: 345
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.areNotEqual(345, obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("isTrue", function () {
        it("correctly checks trueness", function () {
            //Arrange
            var actual = {
                someValue: true
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isTrue(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for falseness", function () {
            //Arrange
            var actual = {
                someValue: false
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isTrue(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("isFalse", function () {
        it("correctly checks falseness", function () {
            //Arrange
            var actual = {
                someValue: false
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isFalse(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for trueness", function () {
            //Arrange
            var actual = {
                someValue: true
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isFalse(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("isNull", function () {
        it("correctly checks null", function () {
            //Arrange
            var actual = {
                someValue: null
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isNull(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for not null", function () {
            //Arrange
            var actual = {
                someValue: 3
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isNull(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("isNotNull", function () {
        it("correctly checks not null", function () {
            //Arrange
            var actual = {
                someValue: 3
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isNotNull(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("fails expectation for null", function () {
            //Arrange
            var actual = {
                someValue: null
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isNotNull(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
    });

    describe("with", function () {

        it("allows navigation through levels", function () {
            //Arrange
            var actual = {
                inner: {
                    value: 3
                },
                value: 2
            };
            
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.areEqual(2, obj.value)
                        .with(obj.inner, function (obj) {
                            this.areEqual(3, obj.value)
                                .areNotEqual(2, obj.value);
                        });
                });
            });
            
            //Assert
            expect(result.status).toBe(PASSED);
        });

        it("allows navigation through multiple levels", function () {
            //Arrange
            var actual = {
                inner: {
                    level2: {
                        value: 45
                    }
                },
                value: 2
            };
        
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.with(obj.inner, function (obj) {
                        this.with(obj.level2, function (obj) {
                            this.areEqual(45, obj.value);
                        });
                    })
                    .areEqual(2, obj.value);
                });
            });
        
            //Assert
            expect(result.status).toBe(PASSED);
        });

    });
    
    describe("extension methods", function () {
        AssertChain.Extensions.isThree = function (value) {
                this.areEqual(3, value);
                return this;
            };
        it("fails if extension method does not exist", function () {
            //Arrange
            var actual = {
                someValue: 3
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isFour(obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(FAILED);
        });
        
        it("correctly calls extension method if it exists", function () {
            //Arrange
            var actual = {
                someValue: 3
            };
       
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.isThree(obj.someValue)
                        .areEqual(3, obj.someValue);
                });
            });
       
            //Assert
            expect(result.status).toBe(PASSED);
        });
        
        it("allows the use of the context value", function () {
            //Arrange
            AssertChain.Extensions.someValueIs = function (expected) {
                this.areEqual(expected, this.context.someValue);
                return this;
            }
            var actual = {
                someValue: 33
            };
            
            //Act
            var result = internalTest(function () {
                AssertChain.with(actual, function (obj) {
                    this.someValueIs(33)
                        .areEqual(33, obj.someValue);
                });
            });
            
            //Assert
            expect(result.status).toBe(PASSED);
        });
    });

    function internalTest(testFunc) {
        var outerEnvironment = jasmine.currentEnv_;
        var env = new jasmine.Env();
        jasmine.currentEnv_ = env;
        var spec;
        env.describe("fake suite", function () {
            spec = env.it("fake test", function () {
                testFunc();
            });
        });

        env.execute();

        jasmine.currentEnv_ = outerEnvironment;

        return spec.result;
    }
});

describe("README examples", function () {
    it("works for basic usage", function () {
        //Arrange
        var response = {
            intValue: 3,
            objectValue: {
                stringValue: "some value"
            }     
        };

        //Act
        var actual = response;

        //Assert
        AssertChain.with(actual, function (obj) {
            //obj is equal to actual here
            this.areEqual(3, obj.intValue)
                .areNotEqual(4, obj.intValue)
                .with(obj.objectValue, function (obj) {
                    //obj is now equal to actual.objectValue
                    this.areEqual("some value", obj.stringValue)
                        .isTrue(obj.stringValue.length > 0);
                });
        });
    });
    
    it("performs expects on employees correctly", function () {
        var actual = {
            employees: [{
                firstName: "John",
                lastName: "Smith",
                age: 55,
                phoneNumbers: ["123-456-7890"]  
            },
            {
                firstName: "Mary",
                lastName: "Jones",
                age: 33,
                phoneNumbers: ["987-654-3210", "555-555-5555"]  
            }]
        };
        
        expect(actual.employees.length).toBe(2);
        expect(actual.employees[0].firstName).toBe("John");
        expect(actual.employees[0].lastName).toBe("Smith");
        expect(actual.employees[0].age).toBe(55);
        expect(actual.employees[0].phoneNumbers.length).toBe(1);
        expect(actual.employees[0].phoneNumbers[0]).toBe("123-456-7890");
        expect(actual.employees[1].firstName).toBe("Mary");
        expect(actual.employees[1].lastName).toBe("Jones");
        expect(actual.employees[1].age).toBe(33);
        expect(actual.employees[1].phoneNumbers.length).toBe(2);
        expect(actual.employees[1].phoneNumbers[0]).toBe("987-654-3210");
        expect(actual.employees[1].phoneNumbers[1]).toBe("555-555-5555");
    });
    
    it("performs assertchain on employees correctly", function () {
        var actual = {
            employees: [{
                firstName: "John",
                lastName: "Smith",
                age: 55,
                phoneNumbers: ["123-456-7890"]  
            },
            {
                firstName: "Mary",
                lastName: "Jones",
                age: 33,
                phoneNumbers: ["987-654-3210", "555-555-5555"]  
            }]
        };
        
        AssertChain.with(actual.employees, function (obj) {
            this.areEqual(2, obj.length)
                .with(obj[0], function (obj) {
                    this.areEqual("John", obj.firstName)
                        .areEqual("Smith", obj.lastName)
                        .areEqual(55, obj.age)
                        .areEqual(1, obj.phoneNumbers.length)
                        .areEqual("123-456-7890", obj.phoneNumbers[0]);
                })
                .with(obj[1], function (obj) {
                    this.areEqual("Mary", obj.firstName)
                        .areEqual("Jones", obj.lastName)
                        .areEqual(33, obj.age)
                        .with(obj.phoneNumbers, function (obj) {
                            this.areEqual(2, obj.length)
                                .areEqual("987-654-3210", obj[0])
                                .areEqual("555-555-5555", obj[1]);
                        });
                })
        });
    });
    
    it("performs assertchain with extensions correctly", function () {
        AssertChain.Extensions.hasName = function (firstName, lastName) {
            this.areEqual(firstName, this.context.firstName)
                .areEqual(lastName, this.context.lastName);
            return this; //Remember to do this to keep fluent syntax
        };
        AssertChain.Extensions.hasAge = function (expectedAge) {
            this.areEqual(expectedAge, this.context.age);
            return this;
        };
        AssertChain.Extensions.hasPhoneNumbers = function () {
            this.areEqual(arguments.length, this.context.phoneNumbers.length);
            for (var i in arguments) {
                this.areEqual(arguments[i], this.context.phoneNumbers[i]);   
            }
            return this;
        };
        
        var actual = {
            employees: [{
                firstName: "John",
                lastName: "Smith",
                age: 55,
                phoneNumbers: ["123-456-7890"]  
            },
            {
                firstName: "Mary",
                lastName: "Jones",
                age: 33,
                phoneNumbers: ["987-654-3210", "555-555-5555"]  
            }]
        };
        
        AssertChain.with(actual.employees, function (obj) {
            this.areEqual(2, obj.length)
                .with(obj[0], function (obj) {
                    this.hasName("John", "Smith")
                        .hasAge(55)
                        .hasPhoneNumbers("123-456-7890");
                })
                .with(obj[1], function (obj) {
                    this.hasName("Mary", "Jones")
                        .hasAge(33)
                        .hasPhoneNumbers("987-654-3210", "555-555-5555");
                })
        });
    });
});