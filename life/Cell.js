function cell(living,neighbors)
{
var self = this;
this.living=living;
this.neighbors=neighbors;
this.spawn=spawn;
function spawn(){
	this.living = 1;
}
this.kill = function kill(){
	this.living = 0;
}
} /* end cell */

function row(size)
{
this.size=size;
this.cells = new Array();

	for (var i=0;i<=size;i++)
	{ 
		var myCell=new cell(0,0);
		this.cells[i] = myCell;
	}


} /* end row */

function grid(num_rows,num_columns){
this.num_rows=num_rows;
this.num_columns=num_columns;
this.rows = new Array();
	for (var i=0;i<=num_rows;i++)
	{ 
		var freshRow=new row(num_columns);
		this.rows[i] = freshRow;
	}
this.getCell= function (row,col){
	var the_row = this.rows[row];
	return the_row.cells[col];
}
this.makeLiving= function (points){
	var length = points.length;
	for (var i = 0; i < length; i++) {
		var sec = points[i];
  		this.getCell(sec[0],sec[1]).spawn();
	}
}
this.neighAbove = function (cur_row,cur_col){
	if(cur_row == 0){
		return 0;
	}
	return this.getCell(cur_row - 1, cur_col).living;
}

this.neighBelow = function (cur_row,cur_col){
	if(cur_row == this.num_rows - 1){
		return 0;
	}
	return this.getCell(cur_row + 1, cur_col).living;
}
this.neighleft = function (cur_row,cur_col){
	if(cur_col == 0){
		return 0;
	}
	return this.getCell(cur_row, cur_col - 1).living;
}
this.neighRight = function (cur_row,cur_col){
	if(cur_col == num_columns - 1){
		return 0;
	}
	return this.getCell(cur_row, cur_col + 1).living;
}
this.neighUpLeft = function (cur_row,cur_col){
	if(cur_col == 0 || cur_row == 0){
		return 0;
	}
	return this.getCell(cur_row - 1, cur_col - 1).living;
}
this.neighUpRight = function (cur_row,cur_col){
	if(cur_col == this.num_columns - 1 || cur_row == 0){
		return 0;
	}
	return this.getCell(cur_row - 1, cur_col + 1).living;
}
this.neighDownLeft = function (cur_row,cur_col){
	if(cur_col == 0 || cur_row == this.num_rows - 1){
		return 0;
	}
	return this.getCell(cur_row + 1, cur_col - 1).living;
}
this.neighDownRight = function (cur_row,cur_col){
	if(cur_col == this.num_columns - 1 || cur_row == this.num_rows - 1){
		return 0;
	}
	return this.getCell(cur_row + 1, cur_col + 1).living;
}
this.totalNeighbors = function  (r,c){
	var reg = this.neighAbove(r,c) + this.neighBelow(r,c) + this.neighRight(r,c) + this.neighleft(r,c);
	var dag = this.neighUpRight(r,c) + this.neighUpLeft(r,c) + this.neighDownRight(r,c) + this.neighDownLeft(r,c);
	return reg + dag;
}
this.setNeighbors = function (){
	for (var r=0;r<this.num_rows;r++)
	{ 
		for (var c=0;c<this.num_columns;c++)
		{ 
			var cur_cell = this.getCell(r,c);
			cur_cell.neighbors = this.totalNeighbors(r,c);
		}
	}
}
this.dup = function (){
	var gridcpy = new grid(this.num_rows,this.num_columns);
	for (var r=0;r<=this.num_rows;r++)
	{ 
		for (var c=0;c<=this.num_columns;c++)
		{ 
			var cur_cell = this.getCell(r,c);
			gridcpy.getCell(r,c).living = cur_cell.living;
			gridcpy.getCell(r,c).neighbors = cur_cell.neighbors;
		}
	}
	return gridcpy;
}
this.fate = function (cell){
	if(cell.living){ /* cell is already living */
		if(cell.neighbors < 2){
			return -1;
		}
		else if(cell.neighbors == 2 || cell.neighbors == 3){
			return 0;
		}
		else{
			return -1;
		}
	} /* end outer if */
	else{ /* cell is dead */
		if(cell.neighbors == 3){
			return 1;
		}
		else{
			return -1;
		}
	} /* end else */
} /* done with this method */
this.id_to_row=function (id){
	return Math.floor(id/this.num_rows);
}
this.id_to_col=function (id){
	return id % this.num_columns;
}
this.updateAll=function (){
	var cpy = this.dup();
	for (var r=0;r<=this.num_rows;r++)
	{ 
		for (var c=0;c<=this.num_columns;c++)
		{ 
			var cur_cell = this.getCell(r,c);
			var cell_fate = cpy.fate(cpy.getCell(r,c));
			if(cell_fate == 1){
				this.getCell(r,c).spawn();
			}
			else if (cell_fate == -1){
				this.getCell(r,c).kill();
			}
		}
	}
}



}/* End grid */
