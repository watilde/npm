var test = require('tap').test
var common = require('../common-tap')

test('npm wombat', function (t) {
  common.npm('wombat', {}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.equal(code, 1, 'command ran with error')

    t.equal(stdout.split('\n').length, 3, 'command not found')

    t.notOk(stderr, 'stderr should be empty')
    t.end()
  })
})

test('npm food', function (t) {
  common.npm('food', {}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.equal(code, 1, 'command ran with error')

    t.has(stdout, 'Did you mean this?')

    t.notOk(stderr, 'stderr should be empty')
    t.end()
  })
})

test('npm jet', function (t) {
  common.npm('jet', {}, function (err, code, stdout, stderr) {
    if (err) throw err
    t.equal(code, 1, 'command ran with error')

    t.has(stdout, 'Did you mean one of these?')

    t.notOk(stderr, 'stderr should be empty')
    t.end()
  })
})
