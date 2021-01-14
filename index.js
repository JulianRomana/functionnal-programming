function addAnother(z) {
  return function addTwo(x, y) {
    return x + y + z
  }
}

var z = 1

function addTwo(x, y) {
  return x + y
}

function addAnother(x, y) {
  return addTwo(x, y) + z
}

addAnother(20, 21)

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