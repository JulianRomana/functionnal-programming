# Functionnal Programming

## Introduction

***

### Why functionnal programming

Funcionnal programming is a way to approach code, a declarative one.

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