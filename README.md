# assertchain-jasmine
Library for creating fluent, extensible assertions in [jasmine](http://jasmine.github.io/) unit tests

The following is typical usage of jasmine expectations
```javascript
//Act
var actual = performSomeTest();

//Assert
expect(actual.someValue).toBe("someExpectedValue");
```

This is a good basis, but can get unwieldy fast.

## Basic Usage

```javascript
var AssertChain = require("assertchain-jasmine");

describe("Test suite", function () {
    it("is some test", function () {
        //Arrange
        var response = {
            intValue: 3,
            objectValue: {
                stringValue: "some value"
            }     
        };
        
        //Act
        var actual = performSomeTest();
        
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
```

## AssertChain functions

The following basic functions are available:
- `areEqual(expected, actual)`
- `areNotEqual(expected, actual)`
- `isTrue(actual)`
- `isFalse(actual)`
- `isNull(actual)`
- `isNotNull(actual)`
- `with(value, function (val) )`

## Reducing clutter

AssertChain can be used to reduce clutter in unit tests. Let's say we're testing the following data:

```javascript
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
```

Consider the following collection of assertions.

```javascript
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
```

Rewriting this with AssertChain

```javascript
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
```

The number of lines increases, but it's easier to spot clusters of data. 


## Extension functions

Occasionally you'll find yourself writing the same assertions over and over. 
AssertChain allows you to easily reuse these assertions.

```javascript
var AssertChain = require("assertchain-jasmine");

AssertChain.Extensions.hasName = function (firstName, lastName) {
    this.areEqual(firstName, this.context.firstName)
        .areEqual(lastName, this.context.lastName);
    return this; //Remember to do this to keep fluent syntax
}

var somePerson = {
    firstName: "John",
    lastName: "Smith",
    age: 55   
};

AssertChain.with(somePerson, function (obj) {
    this.hasName("John", "Smith")
        .areEqual(55, obj.age); //We can still use standard assertion functions
});
```

Let's add some more extension functions for an employee and see how the example would change.

```javascript
var AssertChain = require("assertchain-jasmine");

//declare AssertChain.Extensions.hasName like above
AssertChain.Extensions.hasAge = function (expectedAge) {
    this.areEqual(expectedAge, this.context.age);
    return this;
}
AssertChain.Extensions.hasPhoneNumbers = function () {
    this.areEqual(arguments.length, this.context.phoneNumbers.length);
    for (var i in arguments) {
        this.areEqual(arguments[i], this.context.phoneNumbers[i]);   
    }
    return this;
}
```

The assertions could be rewritten again.

```javascript
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
```