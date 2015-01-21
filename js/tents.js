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
    // Track assigned locations
    this.grid = {};
    var tmp;
    for (tmp in this.trees){
        this.grid[tmp] = true;
    }
    // Add th
    this.camps = updateCamps();

    this.isComplete = function(){
        var tree;
        var count;
        // All trees have been assigned
        for (tree in self.trees){
            if (self.trees[tree] === undefined){ return false; }
        }
        // No unassigned tents
        row_tents.forEach(function(elt, i){
            if (elt != 0){ return false; }
        });
        col_tents.forEach(function(elt, i){
            if (elt != 0){ return false; }
        });
        return true;
    };
    this.selectVariable = function(){
        if (self.trees.length == 0){
            return null;
        }
        var tree;
        var lowest = 5; // 4 is maximum value
        var selected = [];
        for (tree in self.trees){
            if (self.trees[tree] === undefined){
                var loc = tree.split(',');
                var camps = getNeighbors(loc[0],loc[1]);
                if (camps.length < lowest){
                    selected = [tree];
                    lowest = camps.length;
                } else if (camps.length == lowest) {
                    selected.push(tree);
                }
            }
        }

        return selected[0]; // TODO Tiebreaker
    }; // TODO

    this.orderValues = function(tree){
        var loc = tree.split(',');
        return getNeighbors(loc[0],loc[1]); // TODO Actually order them
    }; // TODO
    this.assignTree = function(tree, tent){
        var loc = tent.split(',');
        self.row_tents[loc[0]]--;
        self.col_tents[loc[1]]--;
        self.trees[tree] = tent;
        self.grid[tent] = true;
    };
    this.unassignTree = function(tree){
        var loc = self.trees[tree].split(',');
        self.row_tents[loc[0]]++;
        self.col_tents[loc[1]]++;
        self.grid[self.trees[tree]] = undefined;
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
        row = parseInt(row);
        col = parseInt(col);
        // Check input boundry
        var N = self.row_tents.length;
        if (row < 0 || col < 0 || row >= N || col >= N){
            return [];
        }
        var neighbors = [];

        // Left
        if (col - 1 >= 0){
            if (self.grid[row+','+(col-1)] === undefined &&
                self.row_tents[row] > 0 &&
                self.col_tents[col-1] > 0){
                neighbors.push(row+','+(col-1));
            }
        }
        // Right
        if (col + 1 < N){
            if (self.grid[row+','+(col+1)] === undefined &&
                self.row_tents[row] > 0 &&
                self.col_tents[col+1] > 0){
                neighbors.push(row+','+(col+1));
            }
        }
        // Up
        if (row - 1 >= 0){
            if (self.grid[(row-1)+','+col] === undefined &&
                self.row_tents[row-1] > 0 &&
                self.col_tents[col] > 0){
                neighbors.push((row-1)+','+col);
            }
        }
        // Right
        if (row + 1 < N){
            if (self.grid[(row+1)+','+col] === undefined &&
                self.row_tents[row+1] > 0 &&
                self.col_tents[col] > 0){
                neighbors.push((row+1)+','+col);
            }
        }
        return neighbors;
    }
}

$(document).on('ready',function(){
    // Generate the board
    var N = 0; // N x N board size

    // Creates the forest model and view
    var initialState = createSample();
    createForest(initialState);
    setState(initialState);

    function createForest(state){
        N = state.row_tents.length;

        var grid = $('#forest-table');
        // Create html table representing board
        for (var r = 0; r < N; r++){
            var row = $('<tr>');
            for (var c = 0; c < N; c++){
                var cell = $('<td>').attr({
                    id: 'cell-'+r+'-'+c,
                    class: 'grid-cell'
                }).appendTo(row);
            }
            // Add tent count input as row constraint
            var td = $('<td>');
            var row_count = $('<input>').attr({
                type: 'number',
                id: 'row-'+r,
                name: 'row-'+r,
                class: 'grid-cell',
                value: 0
            }).appendTo(td);
            $(row).append(td);
            $(grid).append(row);
        }
        // Add tent count input as col constraint
        row = $('<tr>');
        for (c = 0; c < N; c++) {
            td = $('<td>');
            var col_count = $('<input>').attr({
                type: 'number',
                id: 'col-'+c,
                name: 'col-'+c,
                class: 'grid-cell',
                value: 0
            }).appendTo(td);
            $(row).append(td);
        }
        $(row).append($('<td>'));
        $(grid).append(row);
    }

    function setState(state){
        var tree;
        // Display tree locations
        for (tree in state.trees){
            var loc = tree.split(',');
            setValue(loc[0],loc[1],Enum.TREE);
            // Display tree's tent
            if (state.trees[tree] != undefined){
                loc = state.trees[tree].split(',');
                setValue(loc[0],loc[1],Enum.TENT);
            }
        }
        // TODO Display possible tent locations
        // Display row/col tent counts
        state.row_tents.forEach(function(count, i){
            $('#row-'+i).val(count);
        });
        state.col_tents.forEach(function(count, i){
            $('#col-'+i).val(count);
        });
    }

    /*
        Sets the value of a location
        Input   : row, col are the location coordinates
                : value is one of the values defined in Enum
     */
    function setValue(row, col, value){
        // Check input boundry
        if (row < 0 || col < 0 || row >= N || col >= N){
            return;
        }
        // Update html
        var cell = $('#'+locToID(row, col));
        cell.attr("class", "");
        switch (value){
            case Enum.UND:
                cell.attr("class", "und");
                break;
            case Enum.TREE:
                cell.attr("class", "tree");
                break;
            case Enum.TENT:
                cell.attr("class", "tent");
                break;
            default:
                break;
        }
        cell.addClass('grid-cell');
    }

    /*
        Input: ID of cell or row/col constraint input
             : Ex. "cell-ROW-COL"
             : Ex. "col-ROW-COL"
        Returns coordinates in array
             : Ex. [row, col]
     */
    function idToLoc(id){
        var coords = id.split('-');
        var row = parseInt(coords[1]);
        var col = parseInt(coords[2]);
        return [row, col];
    }
    function locToID(row, col){
        return 'cell-'+row+'-'+col;
    }

    ///////////////////////////////////////
    ///   CSP Implementation           ///
    ///////////////////////////////////////
    $('#solve_button').on('click',function(e){
        var result = recursiveBacktrack(initialState);
        if (result === false){
            alert("No valid solutions.");
        } else {
            setState(result);
        }
    });

    /*
     Input: GameState representing current assignment
     Returns GameState representing solved tent problem if the initial state was solvable.
     returns false otherwise.
     */
    function recursiveBacktrack(state) {
        if (state.isComplete()) {
            return state;
        }
        var tree = state.selectVariable(); // Most constrained variable
        if (tree === undefined) {
            console.log('wat');
        }
        var camps = state.orderValues(tree); // Least constraining values
        for (var i = 0; i < camps.length; i++){
            var tent = camps[i];
            state.assignTree(tree, tent);
            var result = recursiveBacktrack(state);
            if (result !== false) { return state; }
            state.unassignTree(tree);
        }
        return false; // The given state was not solvable
    }
});

function createSample(){
    var trees = {'0,2' : undefined,
            '1,7' : undefined,
            '2,4' : undefined,
            '3,1' : undefined,
            '4,4' : undefined,
            '4,6' : undefined,
            '6,1' : undefined,
            '6,2' : undefined,
            '6,5' : undefined,
            '7,7' : undefined};
    var row_tents = [2,1,0,1,2,1,2,1];
    var col_tents = [1,2,1,1,1,1,1,2];
    return new GameState(trees, row_tents, col_tents);
}
