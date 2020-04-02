const map = (arr1, arr2) => {
  if (arr1.length === 0) {
    return arr2
  }

  return [...arr1].map((_, i) => {
    if (!arr2[i]) {
      return arr1[i]
    }

    return arr2[i]
  })
}

module.exports = map
