/**
 * Created by jjallen on 12/30/14.
 */
var Enum = {
    EMPTY   : 0,
    UND     : 1,
    TREE    : 2,
    TENT    : 3
};

function GameState(trees, row_tents, col_tents){
    var self = this;
    this.trees = trees;
    this.row_tents = row_tents;
    this.col_tents = col_tents;
    this.camps = updateCamps();

    this.isComplete = function(){
        var tree;
        var count;
        // All trees have been assigned
        for (tree in self.trees){
            if (self.trees[tree] === undefined){ return false; }
        }
        // No unassigned tents
        for (count in row_tents){
            if (count !== 0){ return false; }
        }
        for (count in col_tents){
            if (count !== 0){ return false; }
        }
        return true;
    };
    this.selectVariable = function(){ return false; }; // TODO
    this.orderValues = function(tree){ return false; }; // TODO
    this.assignTree = function(tree, tent){
        var loc = tent.split(',');
        self.row_tents[loc[0]]--;
        self.col_tents[loc[1]]--;
        self.trees[tree] = tent;
    };
    this.unassignTree = function(tree){
        var loc = self.trees[tree].split(',');
        self.row_tents[loc[0]]++;
        self.col_tents[loc[1]]++;
        self.trees[tree] = undefined;
    };

    // TODO
    function updateCamps(){
        // Make empty NxN array
        var N = self.row_tents.length;
        var camps = new Array(N);
        for (var r = 0; r < N; r++){
            camps[r] = new Array(N);
            for (var c = 0; c < N; c++){
                camps[r][c] = 0;
            }
        }
    }

    /*
     Input: The row/col coords of a location
     Returns an array containing the coordinates of locations adjacent to the input
     : Ex. [row, col]
     */
    function getNeighbors(row, col){
        // Check input boundry
        if (row < 0 || col < 0 || row >= N || col >= N){
            return [];
        }
        var neighbors = [];

        // Left
        if (col - 1 >= 0){
            neighbors.push([row, col - 1]);
        }
        // Right
        if (col + 1 < N){
            neighbors.push([row, col + 1]);
        }
        // Up
        if (row - 1 >= 0){
            neighbors.push([row - 1, col]);
        }
        // Right
        if (row + 1 < N){
            neighbors.push([row + 1, col]);
        }
        return neighbors;
    }
}


var trees = [[0,1],
            [1,7],
            [2,4],
            [3,1],
            [4,4],
            [4,6],
            [6,1],
            [6,2],
            [6,5],
            [7,7]];
var row_tents = [2,1,0,1,2,1,2,1];
var col_tents = [1,2,1,1,1,1,1,2];
var state = new GameState(trees, row_tents, col_tents);
