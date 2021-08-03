# Functionnal Programming

## Introduction

***

### Why functionnal programming

Funcionnal programming is a way to approach code, a declarative one.

This pattern has been designed to make certain bugs impossible to happend.

#### Imperative code

> Imperative code is focused on how to do something.
> People will need to read the full code before understanding how it works.
> It forces people to executed the code in their head while reading it.

Harder to understand, maintain, improve, fix.

#### Declarative code

> Declarative code says what the code is doing.

### Functions vs Procedures

A procedure is a **collection of operations**, of things that you need to do 
(it can take some inputs, return an output, be called multiple times,...).

A function has to **return an output**. If a functions doesn't return an output, 
it's **definitely** not a function, it's called a **procedure**.

Functions can **only call other functions**, **no procedures allowed**.

Functions should have a **relashionship between their input and their output**, and relashionships
should be obvious. The **name** of the function makes the relashionship obvious.

Functions should not have side effects.
They should have direct inputs and outputs (inputs passed as parameters, outputs as a returned value)

Not all side effects can be avoided (a console. ..., database storage, network calls, DOM, ...).
There is no such things as "no side effects ", avoir them where possible and make it obvious.
Bugs are more likely to come where you have side effets.

***

## Pure functions

> A **pure function** takes all its **direct inputs**, **returns an output** and has no **side effects**

(more precise definition below)

> A **pure function** call is pure if it has referential transparency. Meaning that if you replace the function call by the value that it returns, it should'nt break the program. If you see a function that has the same input, you will have the confidence that it will produce the same output.

Using an outter variable, without mutating it, in a function still makes it **pure**.The only goal is 
that it should be obvious for the code reader. He needs to not be worried that the outter variable will change.

```javascript
var z = 1

function addTwo(x, y) {
  return x + y
}

function addAnother(x, y) {
  return addTwo(x, y) + z
}

addAnother(20, 21)
```

`addAnother` is a pure function call.

***

## Reducing surface area

```javascript
function addAnother(z) {
  return function addTwo(x, y) {
    return x + y + z
  }
}
```

By doing that (it's currying but not the main purpose of it is used there), we reduce the area
where z assignement can occur (compared to the exemple above), increasing readability, if `z`
is passed as 1, it will stay 1.

***

## Same input, same output

A pure function, **give an input, produces the same output** (if an **object** is passed, an **object** is returned)

## Level of confidence

Using functions calls as pure as possible makes you being more confident on the code you reading.

## Extracting impurity

If a functions is impure, just extract the impure part into a procedure so these 2 behaviors can be distinct

from:

```javascript
function addComment(userId, comment) {
  var record = {
    id: uniqueId(),
    userId,
    text: comment,
  }

  var el = buildCommentElement(record)
  commentsList.appendChild(elem)
}

addComment(42, 'A comment')
```

to: 

```javascript
function newComment(userId, commentId, comment) {
  var record = {
    id: commentId,
    userId,
    text: comment,
  }

  return buildCommentElement(record)
}

var commentId = uniqueId()
var elem = newComment(42, commentId, 'a comment')
commentsList.appendChild(elem)
```

## Function Arguments

An argument if different from a parameter.

A parameter is what you add in the function definition

```js
function addOne(num) {
  return num + 1
}
```

`num` there is an parameter

An argument is what you pass to the function

```js
addOne(12)
```

12 is the argument.

> Arguments get assigned to parameters

There are types of functions.

### Unary function

Takes 1 input returns 1 output

```js
function increment(x) {
  return x + 1
}
```

### Binary function

Takes 2 inputs, returns 1 output

```js
function sum(x, y) {
  return x + y
}
```

### Enary function

Takes more than 2 inputs, pretty uncommun in function programming

## Adapters

### High order functions

A high order function is a function that takes one or several functions as an argument, and/or returns 1 or several functions.

### Shape adapters (high order function utility)

High order function utility are functions that wrap other functions, to make them work in a different way.

```js
function unary(fn) {
  return function one(arg) {
    return fn(arg)
  }
}

function f(...args) {
  return args
}


const un = unary(f)

un(1,2,3,4)// [1]
f(1,2,3,4)// [1,2,3,4]
```

Shape adapters are used to transform functions's shape.

The function `f` originally takes several parameters (enary function) and returns them.
If we want to make this function an `unary` function, we create a shape adapter (called unary on the example above). This function will take the original `f` function, and will return an other function which will take a single parameter and return the result of the call of the `f` function in which we passed the single parameter.
By doing so, we can pass as many arguments as we want, the `f` function will only be called with one parameter, and is transformed to an unary function

Same can be done to transform an unary function to a binary one.

If your functions don't work well together this is what you should think about doing (in order): 

- Can I change the shape of my function at the definition so it fits better

if not: 

- Can I make an adapter so it changes the shape ?

The functional programmer sees code as lego pieces. He tries to make them fit together. Try to use function as familiar as possible.

### Flip and reverse adapter

Flip adapters flips the function parameters.

```js
function flip(fn) {
  return function flipped(arg1, arg2, ...args) {
    return fn(arg2, arg1, ...args)
  }
}

function f(...args) {
  return args
}


const g = flip(f)

g(1,2,3,4) // 2,1,3,4
```

The name `flip` for this function is canonical and common to all functional programming projects. It will always mean that the value returned has transposed the 2 arguments.

Reverse function reverses all the arguments

```js
function reverseArgs(fn) {
  return function reverse(...args) {
    return fn(...args.reverse())
  }
}

function f(...args) {
  return args
}


const g = reverseArgs(f)

g(1,2,3,4) // [4,3,2,1]
```

### Spread adapter

```js
function spreadArgs(fn) {
  return function spread(args) {
    return fn(...args)
  }
}

function f(x, y, z) {
  return x + y + z
}

const g = spreadArgs(f)

g([1,2,3]) // 6
```

The `apply` method in native javascript takes an array and apply them into single arguments to a function.

This pattern will be seen across every functional programming projects.

The unnaply method too (takes several arguments, calls a function with these passed as an array), for example, you just need to switch the spread operator of the example above to the line above.

```js
function spreadArgs(fn) {
  return function spread(...args) {
    return fn(args)
  }
}
```

## Point free

It's defining a function without without needing to define it's inputs. Instead of passing a function definition we would just pass a function that's already been declared.

It is a family of techniques.

The purpose of point free is to abstract the declarative part of the code.

❗️Careful, it can be mindfucking.

❗️Don't overuse these, they can greatly increase complexity, sacrifying readability and understandability.

**Equation reasoning** is the heart of point free style.

You should ask yourself : 

> I have a function, I need to make this function, what kind of shape change i need to do.

### 

### Equation reasoning

It's reasoning in term of equal shapes.

If two functions do different things but have the same shape, they are interchangeable

Imagine that you have a function in which you pass in a callback. If this callback has the same shape as the function called in it, than you can remove the callback call.

from: 

```js
getPerson(function onPerson(person) {
  return fetchPerson(person)
})
```

to: 

```js
getPerson(fetchPerson)
```

### Point free refactor

```js
function isOdd(nb) {
  return nb % 2 == 1
}

function isEven(nb) {
  return !isOdd(nb)
}

isEven(4) // true
```

What are the benefits of the `isEven` function ?
It creates a direct visible relationship with `isOdd`. Instead, if we used `nb % 2 == 0`, the relationship would exist but it wouldn't be as obvious.

Sometimes in functional programming, it will be better to be repetitive.

As a functional programmer, when you have these kinda use case, you should ask yourself, **can this be done in a point free way ?** Can we define the `isEven` function without to have the `nb` parameter.

The goal of point free is to remove the declarative style of the function.

Declarative code is implicit.

Imperative code is explicit.

People would usually say that explicit code is better, but in some senses,  being implicit allows us to handle unnecessary details, allowing better readability.

`isEven` is basically the negate version of `isOdd`.

To do so, we are going to create a utility that will adapt the shape of the function.

Let's create a very famous high order function called `not`

```js
function not(fn) {
  return function negated(...args) {
    return !fn(...args)
  }
}

function isOdd(nb) {
  return nb % 2 == 1
}

const isEven = not(isOdd)

isEven(4)
```

The relationship between `isEven` and `isOdd` is even more clear.

By doing so, we hide the the imperative details through a declarative style of coding.

Check exercise in folder `point-free` 

> When trying to refactor or code in functional programming, think about point freeing and equation reasoning

### Advanced Point free

```js
function mod(y) {
  return function forX(x) {
   return x % y
 }
}

function eq(y) {
  return function forX(x) {
   return x === y
 }
}

const mod2 = mod(2)
const eq1 = eq(1)


function isOdd(x) {
  return eq1(mod2(x))
}
```

This is halfway an `isOdd` function using only functions and point-free techniques.

`eq1(mod2(x))`. This is called **composition**. The output of the `mod2` call, is directly passed into the `eq1` call.

To transform the code above into a fully point-free **isOdd** function, we can create an compose function

```js
const mod2 = mod(2)
const eq1 = eq(1)

function isOdd(x) {
  return eq1(mod2(x))
}

function compose(fn2, fn1) { 
  return function composed(x) {
    return fn2(fn1(x))
  }
}

const isOdd = compose(eq1, mod2)
```

We can clearly see that the shape of the `composed` function is the same as the `isOdd` function. So they are interchangeable. Which means that in the end, our code will look like.

```js
function mod(y) {
  return function forX(x) {
   return x % y
 }
}

function eq(y) {
  return function forX(x) {
   return x === y
 }
}

function compose(fn2, fn1) { 
  return function composed(x) {
    return fn2(fn1(x))
  }
}

const isOdd = compose(eq(1), mod(2))
```

## Closure

```js
function makeCounter() {
  let counter = 0
  function increment() {
    return ++counter
  }
}

const c = makeCounter()

c() // 1
c() // 2
c() // 3
```

The c function is `closing over the counter variable`, remembers it and can increment it, even though the makeCounter function has been called. This phenomenon is called **closure**

❗️❗️ Closure is not necessarily functionally pure. But they can be used in a pure way.

If you are going to use closure in functional programming, close over non changing values. If you mutate values that you are closed over, side effects will happend.

### 

### Lazy vs Eager

```js
function repeater(count) {
  return function allTheAs() {
    return ''.padStart(count, 'A')
  }
}

const A = repeater(3)
A() // 'AAA'
```

This function is called `lazy`, it will execute de `padStart` method only when the `A` function is called. Very useful in cases where the function might not be called and there is a function with heavy computations.
The downside is that you need to call the `A` function every time.
If the function is gonna be called several times, prefer the eager version.

```js
function repeater(count) {
  const str = ''.padStart(count, 'A')
  return function allTheAs() {
    return str
  }
}

const A = repeater(3)
A() // 'AAA'
```

This function is called Earger. The `padStart`, method is called when `repeater` is called. Thanks to closure, is we call `A` multiple times, it will only execute the `padStart` method once, now matter how many times we call the `A` function.
The downside is, if this function never gets called, the `padStart` method would have been called, imagine with a heavy function...

### 

### Memoize

What if we want a function that's called several times but with, most of the time, the same input given ?

```js
function repeater(count) {
  let str
  return function allTheAs() {
    if (str === undefined) {
      str = "".padStart(count, 'A')
    }
    return str
  }
}
```

This function is eager and lazy at the same time. By putting in memory the str, it allows us to use both benefits of earger functions and lazy functions.
The problem is that, it's is an impure function (we closing over variable that is getting reassigned), but it produces a pure function call. This should'nt be used in functionnal programming.

In functional programming libraries, there is a utility called `memoize`

```js
function repeater(count) {
  return memoize(function allTheAs(){
    return "".padStart(count, 'A')
  })
}
```

It basically takes your function as a callback, caches the input once it's called, if a different input is given, it will recall the provided callback, either way, it will just return the cached value that has already been produced by the callback function.

It is much more obviously pure, but under the hood, it kinda does the same as the first example.

### 

### Generalized functions to Specialized functions

```js
function ajax(url, data, cb) {...}

ajax(CUSTOMER_API, { id: 911 }, renderCustomer)

-------

function getCustomer(data, cb) {
  return ajax(CUSTOMER_API, data, cb)
}

getCustomer({ id: 911 }, renderCustomer)
```

Just above we have basically the same behavior, but one is more specialized. The purpose of wrappring the `ajax` function in a `getCustomer` function is to have a more clearly described purpose of the function.

> A name of a function describes it's purpose.

We can go even further by adding an other wrapping function to the previous `getCustomer`.

```js
function ajax(url, data, cb) {...}

function getCustomer(data, cb) {...}

function getCurrentUser(cb) {
  return getCustomer({id: 911}, cb)
}

getCurrentUser(renderCustomer)
```

We could have just declared the `getCurrentUser` with the `ajax` function, but using the intermediate `getCustomer` function creates a clear relationship.

> `getCurrentUser` is the specialization of `getCustomer`

But saying *`getCurrentUser` is the specialization of `ajax`* is a weaker statement that doesnt means anything in term of relationship.

How can we define these more specialized functions but witout having to have pointed functions ? [(see partial application and currying section)](#partial-application---currying)

Parameters should always be passed from the more general, to the more specific.

- `function getCustomer(callback, id){...}`

- `Array.reduce((acc, val))`

- `map(callback, array)` (ramda's map)

Why ? Usually when you write a function, you will use the more general values passed in first.
In every functional programming library you will encounter this kind of behavior.

### 

### Partial application - Currying

#### Partial application

In every functional programming library, you will find a utility called `partial`.

```js
function ajax(url, data, cb) {...}

const getCustomer = partial(ajax, CUSTOMER_API)
const getCurrentUser = partial(getCustomer, { id: 911 })

getCustomer({id: 911}, renderCustomer)
getCurrentUser(renderCustomer)
```

The purpose of the `partial` utility is that you create partial applications by specifiying the arguments that will be passed to the function.
On the `getCustomer` declaration, we provide the `CUSTOMER_API` to the `ajax` function, so this first parameter will already be specified.

#### Currying

Currying is the more common technique for function specialization.

```js
function ajax(url) {
  return function getData(data) {
    return function getCB(cb) {...}
  }
}
ajax(CUSTOMER_API)({ id: 911 })(renderCustomer)

const getCustomer = ajax(CUSTOMER_API)
const getCurrentUser = getCustomer({ id: 911 })
```

It exists a utility that does currying for us.

```js
const ajax = curry(
  3,
  function ajax(url, data, cb) { ... }
)
const getCustomer = ajax(CUSTOMER_API)
const getCurrentUser = getCustomer({ id: 911 })
```

#### Partial application vs Currying

- Both are specialization techniques

- Partial application presets some arguments now, receives the rest on the next call

- Currying doesn't presets any arguments, receives each arguments one at the time

## Composition

**Composition** is basically using the output of a function as the input of an other function.

```js
function minus2(x) { return x - 2 }
function triple(x) { return x * 3 }
function increment(x) { return x + 1 }


totalCost = basePrice + minus2(triple(increment(4)))
```

Allows us to not use temp variable to store the data. These would just make the code unreadable.

To add maintainablity, we can create a function that will describe what it's happening
this is called an **abstraction**

```js
function minus2(x) { return x - 2 }
function triple(x) { return x * 3 }
function increment(x) { return x + 1 }

function shippingRate(x){
  return minus2(triple(increment(x)))
}

totalCost = basePrice + shippingRate(4)
```

## Immutability

Immutability isn't `things that can't change` it's more `things don't change unexpectedly.



There are 2 big problems that we face when we want to do immutability: 

- Assignment immutability

- Value immutability



99 % of the time the problem that we will face will be `Value immutability`

### Assignment immutability

`When you assign something to a variable, it can no longer allow to be reassigned to some other value. `



### Value immutability

Value immutability is when a property of an object or a value in an array don't change.



To achieve that goal we have the `Object.freeze()` function. This allows us to create a **read-only** data structure. Thing is we actually don't really need it to be immutable, we just need to warn the reader of the code that the object that will be passed to a function won't be mutated. 



#### Fatal crash vs sneaky mutation

What we actually is an error that would break the app. If a frozen object is being mutated, it will create a fatal error and the code will crash, forcing a developer to fix it. If it was a sneaky mutation, it could take ages to find where this mutation occured



### Read-only data structures

Read only data structures are data structures that **never** need to be mutated

As a functionnal programmer, every time you get a value passed in your function, you always should assume that this data shouldn't be mutated.