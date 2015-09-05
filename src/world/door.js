RAPT.ONE_WAY = 0;
RAPT.TWO_WAY = 1;

RAPT.Door = function(edge0, edge1, cell0, cell1, diag) {
	this.cells = [cell0, cell1];
	this.edges = [edge0, edge1];

	this.diag = diag;

	this.d = [];
	if(cell0 && edge0) this.add3dDoor(0, cell0, edge0);
	if(cell1 && edge1) this.add3dDoor(1, cell1, edge1);

	this.toOpen = false;
	this.toClose = false;

	this.posZ = 0;
}
RAPT.Door.prototype = {
	constructor: RAPT.Door,
	doorExists : function(i) {
		if (this.edges[i] === null) return false;
		var cell = this.cells[i];
		return cell !== null && cell.getEdge(this.edges[i]) !== -1;
	},
	doorPut : function(i, kill) {
		if (this.edges[i] !== null && !this.doorExists(i)) {
			var cell = this.cells[i];
			if (cell === null) return;
			cell.addEdge(new RAPT.Edge(this.edges[i].getStart(), this.edges[i].getEnd(), this.edges[i].color));

			this.toClose = true;

			if (kill) RAPT.gameState.killAll(this.edges[i]);
			RAPT.gameState.recordModification();
		}
	},
	tick : function(seconds) {

		if(this.toOpen){
			if(this.posZ > -0.5){
				this.posZ -= 0.01;
			    if(this.d[0])this.d[0].position.z = this.posZ;
			    if(this.d[1])this.d[1].position.z = this.posZ;
			}else{
				this.toOpen = false;
			}
		}

		if(this.toClose){
			if(this.posZ < 0){
				this.posZ += 0.01;
			    if(this.d[0])this.d[0].position.z = this.posZ;
			    if(this.d[1])this.d[1].position.z = this.posZ;
			}else{
				this.toClose = false;
			}
		}

	},
	doorRemove : function(i) {
		if (this.edges[i] !== null && this.doorExists(i)) {
			var cell = this.cells[i];
			if (cell === null) return;
			cell.removeEdge(this.edges[i]);
			this.remove3dDoor(i);
			RAPT.gameState.recordModification();
			//this.d[i].position.z = -2.5;
			this.toOpen = true;
		}
	},
	add3dDoor:function(i, cell, edge){
	//console.log('door add', type)
	    var x = cell.x;
	    var y = cell.y;
	    var start = edge.getStart();
	    var end = edge.getEnd();
	    var color = edge.color;
	    //var diag = true;
	    var type = edge.getOrientation();



	    //if(start.x == end.x || start.y == end.y) diag = false;

		if(this.diag == 0){
			this.d[i] = new THREE.Mesh(RAPT.GEO['door0']);
		}else{
			//console.log(this.diag)
			type = 0;
			if(start.x < end.x)type = 3;

			if(this.diag==4) this.d[i] = new THREE.Mesh(RAPT.GEO['door1']);
			else this.d[i] = new THREE.Mesh(RAPT.GEO['door2']);
		}

		switch(type){
        	case 1:this.d[i].rotation.z =-RAPT.PI90; break
            case 2:this.d[i].rotation.z =RAPT.PI90; break
            case 3:this.d[i].rotation.z =RAPT.PI;  break
            case 0:this.d[i].rotation.z =0;  break
        }

		this.d[i].position.set(x+0.5,y+0.5, 0 );
		if(color==1) this.d[i].material = RAPT.MAT_DOOR_R;
		else if(color==2)this.d[i].material = RAPT.MAT_DOOR_B
		else this.d[i].material = RAPT.MAT_DOOR;
		//RAPT.W3D.scene.add(this.d[i]);

		RAPT.W3D.addDoor(this.d[i]);

	},
	remove3dDoor:function(i){
		RAPT.W3D.scene.add(this.d[i]);
	},
	act : function(behavior, force, kill) {
		for (var i = 0; i < 2; ++i) {
			switch (behavior) {
			case RAPT.DOORBELL_OPEN:
				this.doorRemove(i);
				break;
			case RAPT.DOORBELL_CLOSE:
				this.doorPut(i, kill);
				break;
			case RAPT.DOORBELL_TOGGLE:
				if(this.doorExists(i)) {
					this.doorRemove(i);
				} else
					this.doorPut(i, kill);
				break;
			}
		}
	}
}
