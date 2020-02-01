// 1. Create a grid (map) 10 by 9
// 2. Create dimmed (barriers) square 12 randomly in the map (Grid)
//    Create a function to obtain random number between 1 and 10 (Position)
//    Call function to gte 2 number
//    Use that numbers to find square
//    add class .barrier to found square
// 3. Choose 4 weapons to be created randomly in the map
// 4. Create weapons randomly in the map
// 5. Create player class (start with a default weapon)

(function () {
  const weapons = [ 'weapon1', 'weapon2', 'weapon3', 'weapon4' ];

  function getRndNumber() {
    return Math.floor(Math.random() * (10 - 1) + 1);
  }

  function placeBarrier() {
    const rowPosition = getRndNumber();
    const colPosition = getRndNumber();
    const cell = document.querySelectorAll(`div[data-row="${rowPosition}"][data-col="${colPosition}"]`)[0];

    if (cell.classList.contains('taken')) {
      console.log('exist something int that position');
      return placeBarrier();
    }

    console.log('placing barrier');
    cell.classList.add('barrier');
    cell.classList.add('taken');
  }

  function placeWeapon(weapon) {
    const rowPosition = getRndNumber();
    const colPosition = getRndNumber();
    const cell = document.querySelectorAll(`div[data-row="${rowPosition}"][data-col="${colPosition}"]`)[0];

    if (cell.classList.contains('taken')) {
      console.log('exist something int that position');
      return placeWeapon(weapon);
    }

    console.log('placing weapon');
    cell.classList.add(weapon);
    cell.classList.add('taken');
  }

  function placePlayer(player) {
    const rowPosition = getRndNumber();
    const colPosition = getRndNumber();
    const cell = document.querySelectorAll(`div[data-row="${rowPosition}"][data-col="${colPosition}"]`)[0];

    if (cell.classList.contains('taken')) {
      console.log('exist something int that position');
      return placePlayer(player);
    }

    console.log('placing player');
    cell.classList.add(player.name);
    cell.classList.add('taken');
  }


  function createMap() {
    let cells = '';

    for (let iRow = 1; iRow < 11; iRow++) {
      for (let iCol = 1; iCol < 11; iCol++) {
        cells += `<div class='grid-item' data-row=${iRow} data-col=${iCol}>${iRow},${iCol}</div>`;
      }
    }
    document.getElementById('game-container').innerHTML = cells;
  }

  createMap();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();
  placeBarrier();

  placeWeapon('weapon1');
  placeWeapon('weapon2');
  placeWeapon('weapon3');
  placeWeapon('weapon4');

  placePlayer({ name: 'player1' });
  placePlayer({ name: 'player2' });

})()