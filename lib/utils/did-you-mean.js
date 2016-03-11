module.exports = didYouMean

function levenshteinD (s1, s2) {
  var d = []
  var i = 0

  for (i = 0; i <= s1.length; i++) d[i] = [i]
  for (i = 0; i <= s2.length; i++) d[0][i] = i

  s2.split('').forEach(function (c2, j) {
    s1.split('').forEach(function (c1, i) {
      if (c1 === c2) {
        d[i + 1][j + 1] = d[i][j]
        return
      }
      d[i + 1][j + 1] = Math.min(
        d[i][j + 1] + 1,
        d[i + 1][j] + 1,
        d[i][j] + 1
      )
    })
  })
  return d[s1.length][s2.length]
}

function didYouMean (scmd, commands) {
  var d = []
  var best_similarity = []
  commands.forEach(function (cmd, i) {
    var item = {}
    item[levenshteinD(scmd, cmd)] = i
    d.push(item)
  })
  d.sort(function (a, b) {
    return Number(Object.keys(a)[0]) - Number(Object.keys(b)[0])
  })
  d.forEach(function (item) {
    var key = Number(Object.keys(item)[0])
    if (scmd.length / 2 >= key) {
      best_similarity.push('        ' + commands[item[key]])
    }
  })

  console.log(
    '\nnpm: \'' + scmd + '\' is not a npm command. See \'npm help\'.'
  )

  if (best_similarity.length === 0) return
  if (best_similarity.length === 1) {
    console.log('\nDid you mean this?\n' + best_similarity[0])
  } else {
    console.log(
      ['\nDid you mean one of these?']
        .concat(best_similarity.slice(0, 3)).join('\n')
    )
  }
}
