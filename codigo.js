$(function () {
  for (let i = 1; i <= 8; i++) {
    $(`#drag${i}`).data('data',{
      value: i,
      lastTower: $('#tower1')
    })
  }
  $('.aro').draggable({disabled: true})

  $('#easy').click(function(){
    $('#tower1').data('data',{
      pos: 'left',
      maxValue: 3,
      elements: [$('#drag1'),$('#drag2'),$('#drag3')]
    })
    $('#drag4').css('display','none')
    $('#drag5').css('display','none')
    $('#drag6').css('display','none')
    $('#drag7').css('display','none')
    $('#drag8').css('display','none')
    startGame('easy');
  })
  $('#medium').click(function(){
    $('#tower1').data('data',{
      pos: 'left',
      maxValue: 5,
      elements: [$('#drag1'),$('#drag2'),$('#drag3'),$('#drag4'),$('#drag5')]
    })
    $('#drag6').css('display','none')
    $('#drag7').css('display','none')
    $('#drag8').css('display','none')
    startGame('medium');
  })
  $('#hard').click(function(){
    $('#tower1').data('data',{
      pos: 'left',
      maxValue: 5,
      elements: [$('#drag1'),$('#drag2'),$('#drag3'),$('#drag4'),$('#drag5'),$('#drag6'),$('#drag7'),$('#drag8')]
    })
    startGame('hard');
  })

})

function validarVictoria(level){
  if (level == 'easy') level = 3
  else if(level == 'medium') level = 5
  else level = 8
  const elementsT2 = $('#tower2').data('data').elements.length
  const elementsT3 = $('#tower3').data('data').elements.length
  if (elementsT2 == level || elementsT3 == level) {
    alert('Ganaste!')
  }
}

function startGame(level){
  let jugadas = 0
  $('#jugadas').html(jugadas)
  $('#mainFace').css({
    transform: 'scale(0)',
    'border-radius':'50%'
  })
  setTimeout(function(){
    $('#game').css({
      transform: 'scale(1)',
      'border-radius': 0
    })
  },400)
  $('#tower2').data('data',{
    pos: 'center',
    maxValue: 0,
    elements: []
  })
  $('#tower3').data('data',{
    pos: 'right',
    maxValue: 0,
    elements: []
  })

  let elements = $('#tower1').data('data').elements
  elements[elements.length-1].draggable({disabled:false})
  $( ".tower" ).droppable({
    drop: function( event, ui ) {
      jugadas++
      $('#jugadas').html(jugadas)
      let maxValue = $(this).data("data").maxValue
      let dragValue = ui.draggable.data("data").value
      
      if (dragValue < maxValue) {
        ui.draggable.draggable({
          revert: true
        })
        setTimeout(function(){
          ui.draggable.draggable({revert: false})
        }, 400)
      }
      else{
        let estado = false
        $(this).data('data').elements.forEach(function(el){
          if (el[0] == ui.draggable[0]) estado = true
        })
        if (!estado) $(this).data("data").elements.push(ui.draggable)

        let lastTower = ui.draggable.data('data').lastTower
        let elements = lastTower.data('data').elements
        if (lastTower[0] != $(this)[0]){
          elements.pop()
        } 
        
        if (elements.length > 0){
          elements[elements.length-1].draggable({disabled:false})
          lastTower.data('data').maxValue = elements[elements.length-1].data('data').value
        }else lastTower.data('data').maxValue = 0
        ui.draggable.data('data').lastTower = $(this)
        elements = $(this).data('data').elements
        if (elements.length>1) {
          elements.forEach(el => el.draggable({disabled:true}))
        }
        elements[elements.length-1].draggable({disabled:false})
        $(this).data("data").maxValue = dragValue
      }

      let top = 65.4 - ($(this).data("data").elements.length * 3)
      top = `${top}vh`
      let left
      let position = $(this).data('data').pos
      if (position == 'center') {
        left = 30 + dragValue
        left = `${left}vw`
      }else if (position == 'left') {
        left = 3 + dragValue
        left = `${left}vw`
      }else{
        left = 56.7 + dragValue
        left = `${left}vw`
      }
      ui.draggable.css({
        top,
        left,
        transition: ".4s",
      })
      setTimeout(function(){
        ui.draggable.css({transition: "0s"})
        validarVictoria(level)
      }, 400)
    }
  })
}