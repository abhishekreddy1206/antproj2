/*
 * Copyright (C) 2008-2009 Jeffrey Knockel
 *
 * This file is a part of Ant.
 *
 * Ant is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Ant is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Ant.  If not, see <http://www.gnu.org/licenses/>.
 */

function Piece() {
    this.row = 0;
    this.col = 5;
    this.state = 0;
}

Piece.prototype.rotateCW = function(grid) {
    var old = this.state;
    var nu = (this.state + 1) % this.states.length;
    this.state = nu;
    if (this.overlaps(grid)) {
	this.state = old;
	return false;
    }
    this.state = old;
    this.clear(grid);
    this.state = nu;
    this.draw(grid);
    return true;
}

Piece.prototype.rotateCCW = function(grid) {
    var old = this.state;
    var nu = (this.state - 1) % this.states.length;
    this.state = nu;
    if (this.overlaps(grid)) {
	this.state = old;
	return false;
    }
    this.state = old;
    this.clear(grid);
    this.state = nu;
    this.draw(grid);
    return true;
}

Piece.prototype.moveLeft = function(grid) {
    --this.col;
    if (this.overlaps(grid)) {
	++this.col;
	return false;
    }
    ++this.col;
    this.clear(grid);
    --this.col;
    this.draw(grid);
    return true;
}

Piece.prototype.moveRight = function(grid) {
    ++this.col;
    if (this.overlaps(grid)) {
	--this.col;
	return false;
    }
    --this.col;
    this.clear(grid);
    ++this.col;
    this.draw(grid);
    return true;
}

Piece.prototype.moveDown = function(grid) {
    ++this.row;
    if (this.overlaps(grid)) {
	--this.row;
	return false;
    }
    --this.row;
    this.clear(grid);
    ++this.row;
    this.draw(grid);
    return true;
}

Piece.prototype.drawColor = function(grid, color) {
    var blocks = this.states[this.state];
    for (var b = 0; b < blocks.length; ++b) {
	var coord = blocks[b];
	var i = coord[0];
	var j = coord[1];
	var row = this.row + i;
	var col = this.col + j;
	if (row >= 0) {
	    grid.cells[row].tr.childNodes[col].style.backgroundColor = color;
	}
    }
}

Piece.prototype.overlaps = function(grid) {
    var blocks = this.states[this.state];
    for (var b = 0; b < blocks.length; ++b) {
	var coord = blocks[b];
	var i = coord[0] + this.row;
	var j = coord[1] + this.col;
	if (i >= grid.cells.length) {
	    return true;
	}
	if (j < 0 || j >= grid.cells[0].length) {
	    return true;
	}
	if (i < 0) {
	    continue;
	}
	if (grid.isFilled(i, j)) {
	    return true;
	}
    }
    return false;
}

Piece.prototype.addTo = function(grid) {
    var blocks = this.states[this.state];
    for (var b = 0; b < blocks.length; ++b) {
	var coord = blocks[b];
	var i = coord[0] + this.row;
	var j = coord[1] + this.col;
	grid.fill(i, j);
    }
}

Piece.prototype.draw = function(grid) {
    this.drawColor(grid, this.color);
}

Piece.prototype.clear = function(grid) {
    this.drawColor(grid, 'transparent');
}

function I() {}
I.prototype = new Piece();
I.prototype.color = "red";
I.prototype.states = [
	[[0,-2],[0,-1],[0,0],[0,1]],
	[[-1,0],[0,0],[1,0],[2,0]]];
I.prototype.id = 0;

function J() {}
J.prototype = new Piece();
J.prototype.color = "gray";
J.prototype.states = [
	[[0,-1],[0,0],[0,1],[1,1]],
	[[-1,0],[0,0],[1,-1],[1,0]],
	[[-1,-1],[0,-1],[0,0],[0,1]],
	[[-1,0],[-1,1],[0,0],[1,0]]];
J.prototype.id = 1;

function L() {}
L.prototype = new Piece();
L.prototype.color = "magenta";
L.prototype.states = [
	[[0,-1],[0,0],[0,1],[1,-1]],
	[[-1,0],[0,0],[1,0],[1,1]],
	[[-1,1],[0,-1],[0,0],[0,1]],
	[[-1,-1],[-1,0],[0,0],[1,0]]];
L.prototype.id = 2;

function O() {}
O.prototype = new Piece();
O.prototype.color = "blue";
O.prototype.states = [[[0,-1],[0,0],[1,-1],[1,0]]];
O.prototype.id = 3;

function S() {}
S.prototype = new Piece();
S.prototype.color = "green";
S.prototype.states = [
	[[0,0],[0,1],[1,-1],[1,0]],
	[[-1,-1],[0,-1],[0,0],[1,0]]];
S.prototype.id = 4;

function T() {}
T.prototype = new Piece();
T.prototype.color = "brown";
T.prototype.states = [
	[[0,0],[1,-1],[1,0],[1,1]],
	[[0,0],[1,-1],[1,0],[2,0]],
	[[1,-1],[1,0],[1,1],[2,0]],
	[[0,0],[1,0],[1,1],[2,0]]];
T.prototype.id = 5;

function Z() {}
Z.prototype = new Piece();
Z.prototype.color = "cyan";
Z.prototype.states = [
	[[0,-1],[0,0],[1,0],[1,1]],
	[[-1,1],[0,0],[0,1],[1,0]]];
Z.prototype.id = 6;
