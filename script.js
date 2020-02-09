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

  const DEFAULT_WEAPON = 'weapon';

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
    this.container = document.getElementById(this.containerId);
    this.player1 = null;
    this.player2 = null;
    this.barriers = [];
    this.weapons = TurnBasedGame.DEFAULT_WEAPONS;
    this.playerInTurn = 'player1';
  }

  TurnBasedGame.DEFAULT_WEAPONS = {
    "weapon": {
      key: 'weapon',
      position: null,
      damage: 10,
    },
    "weapon1": {
      key: 'weapon1',
      position: null,
      damage: 20,
    },
    "weapon2": {
      key: 'weapon2',
      position: null,
      damage: 30,
    },
    "weapon3": {
      key: 'weapon3',
      position: null,
      damage: 40,
    },
    "weapon4": {
      key: 'weapon4',
      position: null,
      damage: 50,
    },
  };

  TurnBasedGame.prototype.createPlayer1 = function() {
    return new Player('player1', DEFAULT_WEAPON);
  }

  TurnBasedGame.prototype.createPlayer2 = function() {
    return new Player('player2', DEFAULT_WEAPON);
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

  TurnBasedGame.prototype.isPositionAvailable = function(position, callbackWhileIsTaken) {
    const cell = this.getCell(position.col, position.row);
    if (cell.classList.contains('taken')) {
      console.log('exist something int that position');
      callbackWhileIsTaken && callbackWhileIsTaken();
      return false;
    }

    return true;
  }

  TurnBasedGame.prototype.putClass = function(position, newClass, notTaken) {
    const cell = this.getCell(position.col, position.row);
    console.log('placing ' + newClass);
    cell.classList.add(newClass);
    !notTaken && cell.classList.add('taken');
  }

  TurnBasedGame.prototype.putWeaponInfo = function(position) {
    const cell = this.getCell(position.col, position.row);
    console.log('putting info weapon ' + newClass);
    cell.classList.add('weapon');
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

    const available = this.isPositionAvailable(position, function() {
      self.placeBarrier();
    });

    if (available) {
      this.barriers.push(position);
      this.putClass(position, 'barrier')
    }
  }

  TurnBasedGame.prototype.placeWeapon = function(weapon) {
    const colPosition = getRndNumber();
    const rowPosition = getRndNumber();
    const position = {
      col: colPosition,
      row: rowPosition
    };
    const self = this;

    const available = this.isPositionAvailable(position, function() {
      self.placeWeapon(weapon);
    });

    if (available) {
      this.weapons[weapon].position = position;
      this.putClass(position, weapon, true);
    }
  }

  TurnBasedGame.prototype.placePlayer = function(player) {
    const colPosition = getRndNumber();
    const rowPosition = getRndNumber();
    const position = {
      col: colPosition,
      row: rowPosition
    };
    const me = this;

    const available = this.isPositionAvailable(position, function() {
      me.placePlayer(player);
    });

    if (available) {
      const cell = this.getCell(colPosition, rowPosition);
      player.position = position;
      cell.innerHTML = `<span class="player-weapon ${DEFAULT_WEAPON}" >&nbsp;</span>`;
      this.putClass(position, player.name)
    }
  }

  TurnBasedGame.prototype.findWeaponByPosition = function(newPosition) {
    return Object
      .values(this.weapons)
      .find(weapon => weapon.position && weapon.position.col === newPosition.col && weapon.position.row === newPosition.row);
  };

  TurnBasedGame.prototype.switchWeapon = function(player, newPosition) {
    const newWeapon = this.findWeaponByPosition(newPosition);
    if (newWeapon) {
      // Put down the old weapon
      this.weapons[player.weapon].position = newPosition;
      this.putClass(newPosition, player.weapon, true);

      // Put up the new Weapon to the player
      // For the weapons in use the position attribute is null
      this.weapons[newWeapon.key].position = null;
      this.removeClass(newPosition, newWeapon.key);
      player.weapon = newWeapon.key;
    }
  };

  TurnBasedGame.prototype.movePlayer = function(player, newPosition) {
    const oldCell = this.getCell(player.position.col, player.position.row);
    const newCell = this.getCell(newPosition.col, newPosition.row);

    // Clean old cell content
    oldCell.innerHTML = '&nbsp;';
    // Remove class player from old position
    this.removeClass(player.position, player.name);

    // Set new position and style of player to the new position cell
    player.position = newPosition;
    this.putClass(player.position, player.name);

    // switch weapon if necessary
    this.switchWeapon(player, newPosition);

    // set the player weapon in the cell new content
    newCell.innerHTML = `<span class="player-weapon ${player.weapon}" >&nbsp;</span>`;

    // move turn to next player
    // this.playerInTurn = this.playerInTurn === 'player1' ? 'player2' : 'player1';
  };

  TurnBasedGame.prototype.hasBarriers = function(fromPosition, toPosition) {
    const direction = toPosition.col == fromPosition.col ? 'row' : 'col';
    console.log("TCL: TurnBasedGame.prototype.hasBarriers -> direction", direction)
    const diff = direction === 'col'
      ? fromPosition.col - toPosition.col
      : fromPosition.row - toPosition.row;
    console.log("TCL: TurnBasedGame.prototype.hasBarriers -> diff", diff)

    let col = direction === 'col' ? fromPosition.col - 1 : fromPosition.col;
    let row = direction === 'row' ? fromPosition.row - 1 : fromPosition.row;

    if (diff < 0) {
      col = direction === 'col' ? fromPosition.col + 1 : fromPosition.col;
      row = direction === 'row' ? fromPosition.row + 1 : fromPosition.row;
    }

    const fromPositionWay = { col: col, row: row };

    console.log("TCL: TurnBasedGame.prototype.hasBarriers -> fromPositionWay", fromPositionWay)

    const cell = this.getCell(fromPositionWay.col, fromPositionWay.row);
    if (!cell) {
      return false;
    }
    if (cell.classList.contains('barrier')) {
      console.log('exist a barrier from fromPosition to toPosition');
      return true;
    }

    if (Math.abs(diff) !== Math.abs(fromPosition[direction] - fromPositionWay[direction])) {
      return this.hasBarriers(fromPositionWay, toPosition);
    }

    return false;
  }

  TurnBasedGame.prototype.tryMovePlayer = function(player, newPosiblePosition) {
    const self = this;
    player.canMoveTo(newPosiblePosition, function() {
      if (self.isPositionAvailable(newPosiblePosition) && !self.hasBarriers(player.position, newPosiblePosition)) {
        self.movePlayer(player, newPosiblePosition);
      }
    });
  }

  TurnBasedGame.prototype.tryMovePlayerInTurn = function(newPosiblePosition) {
    this.tryMovePlayer(this[this.playerInTurn], newPosiblePosition);
  }

  TurnBasedGame.prototype.setup = function() {
    this.barriers = [];
    this.weapons = TurnBasedGame.DEFAULT_WEAPONS;
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

    this.player1 = this.createPlayer1();
    this.placePlayer(this.player1);
    this.player2 = this.createPlayer2();
    this.placePlayer(this.player2);

    this.placeWeapon('weapon1');
    this.placeWeapon('weapon2');
    this.placeWeapon('weapon3');
    this.placeWeapon('weapon4');

    const self = this;

    this.container.addEventListener("click", function(event) {
      const element = event.target;
      const newPosiblePosition = {
        col: Number(element.dataset.col),
        row: Number(element.dataset.row)
      };

      self.tryMovePlayerInTurn(newPosiblePosition);
    });
  }

  const game = new TurnBasedGame();
  game.setup();

})()