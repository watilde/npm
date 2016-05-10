var common = require('../common-tap.js')
var test = require('tap').test
var path = require('path')
var mr = require('npm-registry-mock')
var extend = Object.assign || require('util')._extend
var Tacks = require('tacks')
var Dir = Tacks.Dir
var File = Tacks.File

var workdir = path.join(__dirname, path.basename(__filename, '.js'))
var cachedir = path.join(workdir, 'cache')

var fixture = new Tacks(Dir({
  cache: Dir(),
  invalidName: Dir({
    'package.json': File({
      name: ' examples',
      version: '1.2.3'
    })
  }),
  invalidVersion: Dir({
    'package.json': File({
      name: 'examples',
      version: '1.3.00'
    })
  })
}))

function config (cmd) {
  return [
    '--cache', cachedir,
    '--registry', common.registry
  ].concat(cmd)
}

function testWith (test, opt) {
  if (!opt) opt = {}
  return extend(extend({}, {stdio: [0, 1, 'pipe'], cwd: path.join(workdir, test)}), opt)
}

function cleanup () {
  fixture.remove(workdir)
}

function setup () {
  cleanup()
  fixture.create(workdir)
}

var mockServer

test('setup', function (t) {
  setup()

  mr({ port: common.port }, function (err, server) {
    t.ifError(err, 'started server')
    mockServer = server

    t.end()
  })
})

test('attempt publish with invalid name', function (t) {
  common.npm(config(['publish']), testWith('invalidName'), function (err, code, _, stderr) {
    if (err) throw err
    t.is(code, 1)
    t.match(stderr, /Invalid name: " examples"/)
    t.end()
  })
})

test('attempt publish with invalid version', function (t) {
  common.npm(config(['publish']), testWith('invalidVersion'), function (err, code, _, stderr) {
    if (err) throw err
    t.is(code, 1)
    t.match(stderr, /Invalid version: "1.3.00"/)
    t.end()
  })
})

test('attempt force publish with invalid name', function (t) {
  mockServer.filteringRequestBody(function (body) {
    return true
  }).put('/examples', true).reply(201, {ok: true})

  common.npm(config(['publish', '--force']), testWith('invalidName'), function (err, code, _, stderr) {
    if (err) throw err
    t.is(code, 0, 'published without error')
    t.is(stderr, '')
    mockServer.done()
    t.end()
  })
})

test('attempt force publish with invalid name', function (t) {
  mockServer.filteringRequestBody(function (body) {
    return true
  }).put('/examples', true).reply(201, {ok: true})

  common.npm(config(['publish', '--force']), testWith('invalidVersion'), function (err, code, _, stderr) {
    if (err) throw err
    t.is(code, 0, 'published without error')
    t.is(stderr, '')
    mockServer.done()
    t.end()
  })
})

test('cleanup', function (t) {
  mockServer.close()

  cleanup()

  t.end()
})
