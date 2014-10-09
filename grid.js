

function Grid(game) {
    this.game = game;
    var cells = new Array(20);
    this.cells = cells;
    var table = document.createElement('table');
    table.className = 'grid';
    table.cellSpacing = '0';
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    cells.table = table;
    cells.tbody = tbody;
    for (var i = 0; i < 20; ++i) {
	cells[i] = new Array(10);
	var tr = document.createElement('tr')
	cells[i].tr = tr;
        if (i == 0) {
            tr.className = 'top';
        } else if (i == 19) {
            tr.className = 'bottom';
        }
	tbody.appendChild(tr);
	cells[i].isFilled = new Array(10);
	for (var j = 0; j < 10; ++j) {
	    var td = document.createElement('td');
	    td.className = 'cell';
            if (j == 0) {
                td.className += ' left';
            } else if (j == 9) {
                td.className += ' right';
            }
	    tr.appendChild(td);
	}
    }
    this.isFading = false;
}

Grid.prototype.appendTo = function(element) {
    element.appendChild(this.cells.table);
}

Grid.prototype.fill = function(i, j) {
    this.cells[i].isFilled[j] = true;
}

Grid.prototype.isFilled = function(i, j) {
    return this.cells[i].isFilled[j];
}

Grid.prototype.clearRow = function(row) {
    for (var j = 0; j < this.cells[row].length; ++j) {
	this.cells[row].tr.childNodes[j].style.backgroundColor = 'transparent';
	this.cells[row].isFilled[j] = false;
    }
}

Grid.prototype.cycleRows = function(to) {
    var tbody = this.cells.tbody;
    var firstTr = this.cells[0].tr;
    var firstClassName = firstTr.className;
    firstTr.className = '';
    var lastTr = this.cells[to].tr;
    var lastClassName = lastTr.className;
    lastTr.className = '';
    var lastIsFilled = this.cells[to].isFilled;
    tbody.insertBefore(lastTr, this.cells[0].tr);
    for (var i = to; i > 0; --i) {
	this.cells[i].tr = this.cells[i - 1].tr;
	this.cells[i].isFilled = this.cells[i - 1].isFilled;
    }
    this.cells[0].tr = lastTr;
    this.cells[0].isFilled = lastIsFilled;
    this.cells[0].tr.className = firstClassName;
    this.cells[to].tr.className = lastClassName;
}

Grid.prototype.checkLine = function() {
    var cleared = new Array(0);
    row: for (var i = 0; i < this.cells.length; ++i) {
	for (var j = 0; j < this.cells[i].length; ++j) {
	    if (!this.isFilled(i, j)) {
		continue row;
	    }
	}
	cleared.push(i);
    }
    if (cleared.length > 0) {
        window.clearInterval(this.game.timer);
	this.isFading = true;
	this.game.score += this.game.level * cleared.length * 10;
	this.game.scoreElement.innerHTML = this.game.score;
	this.game.lines += cleared.length;
	this.game.linesElement.innerHTML = this.game.lines;
	this.game.level = Math.floor(this.game.lines / 10) + 1;
	this.game.levelElement.innerHTML = this.game.level;
	this.game.interval = 500 - (this.game.level - 1) * 50;
	var trs = new Array(0);
	for (var i = 0; i < cleared.length; ++i) {
	    var tr = this.cells[cleared[i]].tr;
	    trs.push(tr);
	}
	var opacity = 100;
	var grid = this;
	var timeout = window.isIE ? 4 : 1;
	var diff = window.isIE ? 12 : 3;
	window.setTimeout(function() {
	    var isDone = false;
	    opacity -= diff;
	    if (opacity <= 0) {
		isDone = true;
		opacity = 100;
	    }
	    if (window.isIE) { // for ie
		for (var i = 0; i < trs.length; ++i) {
                    var tr = trs[i];
		    for (var j = 0; j < tr.childNodes.length; ++j) {
			tr.childNodes[j].style.setAttribute('filter',
				'alpha(opacity=' + opacity + ')');
		    }
		}
	    } else {
		for (var i = 0; i < trs.length; ++i) {
                    var tr = trs[i];
		    for (var j = 0; j < tr.childNodes.length; ++j) {
		        tr.childNodes[j].style.opacity = opacity / 100;
		    }
		}
	    }
	    if (!isDone) {
		window.setTimeout(arguments.callee, timeout);
	    } else {
		for (var i = 0; i < cleared.length; ++i) {
		    grid.clearRow(cleared[i]);
		    trs[i].style.opacity = 1.0;
		    grid.cycleRows(cleared[i]);
		}
		grid.game.timer = window.setInterval(grid.game.timed,
			grid.game.interval);
		grid.game.newPiece();
		grid.isFading = false;
	    }
	}, timeout);
	return true;
    }
    return false;

}
