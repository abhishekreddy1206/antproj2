

function randomInt(max) {
    return Math.floor(max * Math.random());
}

function getHTTPObject() {
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        return new XMLHttpRequest();
    }
}

function Game() {
    this.interval = 500;
    this.level = 1;
    this.lines = 0;
    this.score = 0;
    this.levelElement = document.createElement('span');
    this.levelElement.className = 'level';
    this.levelElement.innerHTML = this.level;
    this.linesElement = document.createElement('span');
    this.linesElement.className = 'lines';
    this.linesElement.innerHTML = this.lines;
    this.scoreElement = document.createElement('span');
    this.scoreElement.className = 'score';
    this.scoreElement.innerHTML = this.score;
    this.grid = new Grid(this);
    this.gameOver = false;
    this.arrowKeyPressWorks = false;
}

Game.prototype.pieces = [I, J, L, O, S, T, Z];

Game.prototype.appendGridTo = function(element) {
    this.grid.appendTo(element);
}

Game.prototype.appendLevelTo = function(element) {
    element.appendChild(this.levelElement);
}

Game.prototype.appendLinesTo = function(element) {
    element.appendChild(this.linesElement);
}

Game.prototype.appendScoreTo = function(element) {
    element.appendChild(this.scoreElement);
}

Game.prototype.newPiece = function() {
    game.piece = new game.pieces[randomInt(game.pieces.length)]();
    game.piece.draw(game.grid);
    if (game.piece.overlaps(game.grid)) {
        game.gameOver = true;
        window.clearInterval(game.timer);
        logln('Game over');
    }
}

Game.prototype.start = function() {
    var game = this;
    this.piece = new this.pieces[randomInt(this.pieces.length)]();
    this.piece.draw(this.grid);
    document.onkeydown = function(e) {
        if (game.gameOver) {
            return;
        }
        var keyCode;
        if (!e) {
            e = window.event;
        }
        if (e.keyCode) {
            keyCode = e.keyCode;
        } else if (e.which) {
            keyCode = e.which;
        } else if (e.charCode) {
            keyCode = e.charCode;
        } else {
            return;
        }
        switch (keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false; // for ie
        }
        if (game.grid.isFading || game.arrowKeyPressWorks) {
            return;
        }
        switch (keyCode) {
        case 37:
            game.piece.moveLeft(game.grid);
            break;
        case 38:
            game.piece.rotateCW(game.grid);
            break;
        case 39:
            game.piece.moveRight(game.grid);
            break;
        case 40:
            if (game.timed()) {
                window.clearInterval(game.timer);
                game.timer = window.setInterval(game.timed, game.interval);
            }
            break;
        default:
            return;
        }
    };
    this.timed = function() {
        if (!game.piece.moveDown(game.grid)) {
            game.piece.addTo(game.grid);
            if (!game.grid.checkLine()) {
                game.newPiece();
            }
        }
    };
    document.onkeypress = function(e) {
        if (game.gameOver) {
            return;
        }
        var keyCode;
        if (!e) {
            e = window.event; // for ie
        }
        if (e.keyCode) {
            keyCode = e.keyCode;
        } else if (e.which) {
            keyCode = e.which;
        } else if (e.charCode) {
            keyCode = e.charCode;
        } else {
            return;
        }
        switch (keyCode) {
        case 37:
        case 104:
        case 97:
        case 39:
        case 108:
        case 100:
        case 38:
        case 107:
        case 119:
        case 40:
        case 106:
        case 115:
        case 32:
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false; // for ie
        }
        if (game.grid.isFading) {
            return;
        }
        switch (keyCode) {
        case 37:
            if (!game.arrowKeyPressWorks) {
                game.arrowKeyPressWorks = true;
                break;
            }
        case 104:
        case 97:
            game.piece.moveLeft(game.grid);
            break;
        case 39:
            if (!game.arrowKeyPressWorks) {
                game.arrowKeyPressWorks = true;
                break;
            }
        case 108:
        case 100:
            game.piece.moveRight(game.grid);
            break;
        case 38:
            if (!game.arrowKeyPressWorks) {
                game.arrowKeyPressWorks = true;
                break;
            }
        case 107:
        case 119:
            game.piece.rotateCW(game.grid);
            break;
        case 40:
            if (!game.arrowKeyPressWorks) {
                game.arrowKeyPressWorks = true;
                break;
            }
        case 106:
        case 115:
            if (game.timed()) {
                window.clearInterval(game.timer);
                game.timer = window.setInterval(game.timed, game.interval);
            }
            break;
        case 32:
            while(game.piece.moveDown(game.grid));
            if (game.timed()) {
                window.clearInterval(game.timer);
                game.timer = window.setInterval(game.timed, game.interval);
            }
            break;
        }
    };
    this.timed = function() {
        if (!game.piece.moveDown(game.grid)) {
            game.piece.addTo(game.grid);
            if (!game.grid.checkLine()) {
                game.newPiece();
            }
            return false;
        }
        return true;
    };
    this.timer = window.setInterval(this.timed, this.interval);
}
