// 1. Create a grid (map) 10 by 9
// 2. Create dimmed (barriers) square 12 randomly in the map (Grid)
//    Create a function to obtain random number between 1 and 10 (Position)
//    Call function to gte 2 number
//    Use that numbers to find square
//    add class .barrier to found square
// 3. Choose 4 weapons to be created randomly in the map
// 4. Create weapons randomly in the map
// 5. Create player class
// finish step 1
// 6. Start with a default weapon for the players
// 7. Moves for the player (movePlayer)
//   7.1 Update de player => rowPosition and colPosition
//   7.2 Change player in the grid (remove class from the old square and add class to the new square position)
//   7.3 Applied movements rules
//      - Only three parallel squares
//      - Don't pass throw barrier
//      - If the new position has new weapon, we need to switch weapons
// finish step 2


(function () {

  function getRndNumber() {
    return Math.floor(Math.random() * (10 - 1) + 1);
  }

  function Player(name, weapon) {
    this.name = name;
    this.weapon = weapon;
    this.position = {
      col: 0,
      row: 0
    };
  }

  Player.prototype.canMoveTo = function (newPosiblePosition, callbackIfCan) {
    const direction = newPosiblePosition.col == this.position.col ? 'row' : 'col';
    const diffCol = Math.abs(this.position.col - newPosiblePosition.col);
    const diffRow = Math.abs(this.position.row - newPosiblePosition.row);

    const validColPosition = direction === 'col' && diffCol <= 3 && diffRow === 0;
    const validRowPosition = direction === 'row' && diffRow <= 3 && diffCol === 0;

    const canMove = (validColPosition || validRowPosition);
    canMove && callbackIfCan && callbackIfCan();

    return canMove;
  }

  function TurnBasedGame() {
    this.containerId = 'game-container';
    this.defaultWeapon = 'weapon1';
    this.container = document.getElementById(this.containerId);
    this.player1 = null;
    this.player2 = null;
    this.barriers = [];
    this.weapons = [];
    this.playerInTurn = 'player1';
  }

  TurnBasedGame.WEAPONS_ALLOWED = [ 'weapon1', 'weapon2', 'weapon3', 'weapon4' ];

  TurnBasedGame.prototype.createPlayer1 = function() {
    return new Player('player1', this.defaultWeapon);
  }

  TurnBasedGame.prototype.createPlayer2 = function() {
    return new Player('player2', this.defaultWeapon);
  }

  TurnBasedGame.prototype.createMap = function() {
    let cells = '';

    for (let iRow = 1; iRow < 11; iRow++) {
      for (let iCol = 1; iCol < 11; iCol++) {
        cells += `<div class='grid-item' data-col=${iCol} data-row=${iRow} >&nbsp;</div>`;
      }
    }
    this.container.innerHTML = cells;
  }

  TurnBasedGame.prototype.getCell = function(colPosition, rowPosition) {
    return document
      .querySelectorAll(`div[data-col="${colPosition}"][data-row="${rowPosition}"]`)[0];
  }

  TurnBasedGame.prototype.isTaken = function(position, callbackWhileIsTaken) {
    const cell = this.getCell(position.col, position.row);
    if (cell.classList.contains('taken')) {
      console.log('exist something int that position');
      return callbackWhileIsTaken();
    }

    return true;
  }

  TurnBasedGame.prototype.putClass = function(position, newClass) {
    const cell = this.getCell(position.col, position.row);
    console.log('placing ' + newClass);
    cell.classList.add(newClass);
    cell.classList.add('taken');
  }

  TurnBasedGame.prototype.removeClass = function(position, classToRemove) {
    const cell = this.getCell(position.col, position.row);
    console.log('removing ' + classToRemove);
    cell.classList.remove(classToRemove);
    cell.classList.remove('taken');
  }

  TurnBasedGame.prototype.placeBarrier = function() {
    const colPosition = getRndNumber();
    const rowPosition = getRndNumber();
    const position = {
      col: colPosition,
      row: rowPosition
    };
    const self = this;
    this.barriers.push(position);
    this.isTaken(position, function() {
      self.placeBarrier();
    }) && this.putClass(position, 'barrier');
  }

  TurnBasedGame.prototype.placeWeapon = function(weapon) {
    const colPosition = getRndNumber();
    const rowPosition = getRndNumber();
    const position = {
      col: colPosition,
      row: rowPosition
    };
    const self = this;

    this.isTaken(position, function() {
      self.placeWeapon(weapon);
    }) && this.putClass(position, weapon);
  }

  TurnBasedGame.prototype.placePlayer = function(player) {
    const colPosition = getRndNumber();
    const rowPosition = getRndNumber();
    const position = {
      col: colPosition,
      row: rowPosition
    };
    const me = this;

    player.position = position;
    this.isTaken(position, function() {
      me.placePlayer(player);
    }) && this.putClass(position, player.name);
  }

  TurnBasedGame.prototype.tryMovePlayer = function(player, newPosiblePosition) {
    const self = this;
    player.canMoveTo(newPosiblePosition, function() {
      self.removeClass(player.position, player.name);
      player.position = newPosiblePosition;
      self.putClass(player.position, player.name);
      self.playerInTurn = self.playerInTurn === 'player1' ? 'player2' : 'player1';
    });
  }

  TurnBasedGame.prototype.tryMovePlayerInTurn = function(newPosiblePosition) {
    this.tryMovePlayer(this[this.playerInTurn], newPosiblePosition);
  }

  TurnBasedGame.prototype.setup = function() {
    this.createMap();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();
    this.placeBarrier();

    this.placeWeapon('weapon1');
    this.placeWeapon('weapon2');
    this.placeWeapon('weapon3');
    this.placeWeapon('weapon4');

    this.player1 = this.createPlayer1();
    this.placePlayer(this.player1);
    this.player2 = this.createPlayer2();
    this.placePlayer(this.player2);

    const self = this;

    this.container.addEventListener("click", function(event) {
      const element = event.target;
      const newPosiblePosition = { col: Number(element.dataset.col), row: Number(element.dataset.row) };

      self.tryMovePlayerInTurn(newPosiblePosition);

      //      - Only three parallel squares
      //      - Don't pass throw barrier
      //      - If the new position has new weapon, we need to switch weapons
    });
  }

  const game = new TurnBasedGame();
  game.setup();

})()