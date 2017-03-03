(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = window.jQuery
var robin = require('roundrobin')
var shufflearray = require('shuffle-array')

function compute_rounds (teams, dorematch, shuffle) {
  if (shuffle) {
    shufflearray(teams)
  }

  var rounds = robin(teams.length, teams)

  if (dorematch) {
    var return_rounds = []
    for (var i = 0; i < rounds.length; i++) {
      var fixtures = []
      for (var j = 0; j < rounds[i].length; j++) {
        var match = rounds[i][j]
        var rematch = [match[1], match[0]]
        fixtures.push(rematch)
      }
      return_rounds.push(fixtures)
    }
    rounds = rounds.concat(return_rounds)
  }

  return rounds
}

$('body').on('submit', 'form', function (e) {
  e.preventDefault()

  var teams = $('#teams').val()
    .split('\n')
    .map(function (x) { return x.trim() })
    .filter(function (x) { return x })

  console.log(teams)
  if (window.tc) { window.tc() }

  var rematch = $('#return').prop('checked')
  var shuffle = $('#shuffle').prop('checked')
  var rounds = compute_rounds(teams, rematch, shuffle)

  // var before = $('main').html()
  $('main').html('')

  var rendered = $('<div>')
    .append("\n<div class=\"ad\">\n  <script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n  <!-- big-header -->\n  <ins class=\"adsbygoogle\"\n       style=\"display:inline-block;width:970px;height:90px\"\n       data-ad-client=\"ca-pub-2758632292127860\"\n       data-ad-slot=\"7802966782\"></ins>\n  <script>\n  (adsbygoogle = window.adsbygoogle || []).push({});\n  </script>\n</div>\n    ")
    .append(
      $('<div>').addClass('pure-u-1').append(
        $('<a>')
          .addClass('print pure-button pure-button-primary')
          .text('imprimir sem propaganda')
          .click(function () { window.print() })
      )
    )

  var table = $('<div>').addClass('pure-g table')
  $(rounds).each(function (i, round) {
    var roundElem = $('<div>').addClass('pure-u-1 round')
    roundElem.append($('<h3>').text('Rodada ' + (i + 1)))

    $(round).each(function (j, match) {
      roundElem.append(
        $('<div>').addClass('pure-g game')
          .append($('<div>').addClass('pure-u-1-3 home team').text(match[0]))
          .append($('<div>').addClass('pure-u-1-3 x').text('-'))
          .append($('<div>').addClass('pure-u-1-3 away team').text(match[1]))
      )
    })

    table.append(roundElem)
  })

  $('main').append(
    rendered.append(
      table
    )
  )

  return false
})

$('form button')
  .html('Gerar tabela!')
  .prop('disabled', false)

},{"roundrobin":2,"shuffle-array":3}],2:[function(require,module,exports){
const DUMMY = -1;
// returns an array of round representations (array of player pairs).
// http://en.wikipedia.org/wiki/Round-robin_tournament#Scheduling_algorithm
module.exports = function (n, ps) {  // n = num players
  var rs = [];                  // rs = round array
  if (!ps) {
    ps = [];
    for (var k = 1; k <= n; k += 1) {
      ps.push(k);
    }
  } else {
    ps = ps.slice();
  }

  if (n % 2 === 1) {
    ps.push(DUMMY); // so we can match algorithm for even numbers
    n += 1;
  }
  for (var j = 0; j < n - 1; j += 1) {
    rs[j] = []; // create inner match array for round j
    for (var i = 0; i < n / 2; i += 1) {
      if (ps[i] !== DUMMY && ps[n - 1 - i] !== DUMMY) {
        rs[j].push([ps[i], ps[n - 1 - i]]); // insert pair as a match
      }
    }
    ps.splice(1, 0, ps.pop()); // permutate for next round
  }
  return rs;
};

},{}],3:[function(require,module,exports){
'use strict';

/**
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Boolean} [options.copy] - Sets if should return a shuffled copy of the given array. By default it's a falsy value.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle expect an array as parameter.');
  }

  options = options || {};

  var collection = arr,
      len = arr.length,
      rng = options.rng || Math.random,
      random,
      temp;

  if (options.copy === true) {
    collection = arr.slice();
  }

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
};

/**
 * Pick one or more random elements from the given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Number} [options.picks] - Specifies how many random elements you want to pick. By default it picks 1.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Object}
 */
shuffle.pick = function(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle.pick() expect an array as parameter.');
  }

  options = options || {};

  var rng = options.rng || Math.random,
      picks = options.picks || 1;

  if (typeof picks === 'number' && picks !== 1) {
    var len = arr.length,
        collection = arr.slice(),
        random = [],
        index;

    while (picks && len) {
      index = Math.floor(rng() * len);
      random.push(collection[index]);
      collection.splice(index, 1);
      len -= 1;
      picks -= 1;
    }

    return random;
  }

  return arr[Math.floor(rng() * arr.length)];
};

/**
 * Expose
 */
module.exports = shuffle;

},{}]},{},[1]);
