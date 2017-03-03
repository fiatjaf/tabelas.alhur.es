const $ = window.jQuery
const robin = require('roundrobin')
const shufflearray = require('shuffle-array')

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
  if (window.tc) window.tc()

  var rematch = $('#return').prop('checked')
  var shuffle = $('#shuffle').prop('checked')
  var rounds = compute_rounds(teams, rematch, shuffle)

  // var before = $('main').html()
  $('main').html('')

  var rendered = $('<div>')
    .append(`
<div class="ad">
  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <!-- big-header -->
  <ins class="adsbygoogle"
       style="display:inline-block;width:970px;height:90px"
       data-ad-client="ca-pub-2758632292127860"
       data-ad-slot="7802966782"></ins>
  <script>
  (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
    `)
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
