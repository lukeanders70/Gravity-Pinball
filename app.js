var mousedownID = -1;  //indicates if mouse is down

var make_sphere = function(r, center, num_lat, num_lon, mass, last_position){
	var num_vertices = 0

	for (let lat = 1.0; lat <= num_lat + 1.0; ++lat) {
		for (let lon = 0.0; lon < num_lon; ++lon) {
			let a1 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a2 = (lon / (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x00 = (r * Math.sin(a2) * Math.sin(a1));
			let y00 = (r * Math.cos(a1));
			let z00 = (r * Math.sin(a1) * Math.cos(a2));


			let a3 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a4 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x10 = (r * Math.sin(a4) * Math.sin(a3));
			let y10 = (r * Math.cos(a3));
			let z10 = (r * Math.sin(a3) * Math.cos(a4));


			let a5 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a6 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x11 = (r * Math.sin(a6) * Math.sin(a5));
			let y11 = (r * Math.cos(a5));
			let z11 = (r * Math.sin(a5) * Math.cos(a6));


			let a7 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a8 = ((lon)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x01 = (r * Math.sin(a8) * Math.sin(a7));
			let y01 = (r * Math.cos(a7));
			let z01 = (r * Math.sin(a7) * Math.cos(a8));

			triangleVertices.push(x00)
			triangleVertices.push(y00)
			triangleVertices.push(z00)
			triangleVertices.push(1.0)
			triangleVertices.push(1.0)
			triangleVertices.push(0.0)

			triangleVertices.push(x10)
			triangleVertices.push(y10)
			triangleVertices.push(z10)
			triangleVertices.push(0.7)
			triangleVertices.push(0.0)
			triangleVertices.push(0.3)


			triangleVertices.push(x01)
			triangleVertices.push(y01)
			triangleVertices.push(z01)
			triangleVertices.push(1.0)
			triangleVertices.push(0.0)
			triangleVertices.push(0.0)


			triangleVertices.push(x10)
			triangleVertices.push(y10)
			triangleVertices.push(z10)
			triangleVertices.push(0.0)
			triangleVertices.push(1.0)
			triangleVertices.push(0.0)


			triangleVertices.push(x11)
			triangleVertices.push(y11)
			triangleVertices.push(z11)
			triangleVertices.push(0.0)
			triangleVertices.push(0.0)
			triangleVertices.push(1.0)


			triangleVertices.push(x01)
			triangleVertices.push(y01)
			triangleVertices.push(z01)
			triangleVertices.push(0.0)
			triangleVertices.push(0.3)
			triangleVertices.push(0.7)

			num_vertices += 6;

		}
	}
	var object = {type:"sphere", 
					radius:r, 
					center:center, 
					num_vertices:num_vertices,
					mass:mass,
					last_position:last_position,
					new_center:center
				};
	return object;
};


////////////////////////////////////////////////////
//////////// ALGEBRA HELPERS //////////////////////
//////////////////////////////////////////////////

var v_add = function(v1, v2){
	return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

var v_sub = function(v1, v2){
	return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

var v_div = function(v, n){
	return [v[0]/n, v[1]/n, v[2]/n];
}

var v_mul = function(v, n){
	return [v[0]*n, v[1]*n, v[2]*n];
}

function v_rotateY(out, a, b, c) {
  var p = [],
      r = [];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}


var distance = function(v1, v2){
	var dist = Math.sqrt(Math.pow(v1[0]-v2[0], 2) + Math.pow(v1[1]-v2[1],2) + Math.pow(v1[2]-v2[2], 2));
	return dist
}

var direction = function(v1, v2){
	return v_div(v_sub(v2,v1),distance(v2, v1))
}

var v_dot = function(v1, v2){
	return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
};

var find_fe = function(origin, point){
	let vec = v_sub(point, origin);
	vec[1] = 0.0 //project onto xz plane
	if(vec[2] <=0){
		return Math.acos(v_dot(vec,[1.0,0.0,0.0]) / distance(vec, [0.0,0.0,0.0]));
	}else{
		return 2*Math.PI - Math.acos(v_dot(vec,[1.0,0.0,0.0]) / distance(vec, [0.0,0.0,0.0]));
	}
}

var find_theta = function(origin, point){
	let vec = v_sub(point, origin);
	return Math.acos(v_dot(vec,[0.0,1.0,0.0]) / distance(vec, [0.0,0.0,0.0]));
}
var unit_from_theta_fe = function(theta, fe){
	var vec =[Math.sin(theta), Math.cos(theta), 0.0];
	var ret = [0.0,0.0,0.0]
	v_rotateY(ret, vec, [0.0,1.0,0.0], fe);
	return ret;
}

/////////////////////////////////////////////////
//////// PHYSICS SIMULATION ////////////////////
///////////////////////////////////////////////

var calculate_forces = function(object, objects){
	object.forces = [0.0,0.0,0.0];
	for(var obj_ind = 0; obj_ind < objects.length; ++obj_ind){
		let to_compare = objects[obj_ind];
		if(object != to_compare){
			let force_magnitude = (object.mass * to_compare.mass) / Math.pow(distance(object.center, to_compare.center), 2);
			let force_direction = direction(object.center, to_compare.center);

			if(distance(object.center, to_compare.center) > object.radius + to_compare.radius){
				object.forces[0] += force_magnitude * force_direction[0];
				object.forces[1] += force_magnitude * force_direction[1];
				object.forces[2] += force_magnitude * force_direction[2];
			}
			else{
				object.forces[0] += force_magnitude * -0.5*force_direction[0];
				object.forces[1] += force_magnitude * -0.5*force_direction[1];
				object.forces[2] += force_magnitude * -0.5*force_direction[2];
			}

		}
	}
};

var calculate_new_position = function(object, delta_t){
	let velocity = v_sub(object.center, object.last_position);
	let acceleration = 0.0;
	if(object.mass != 0.0){
		acceleration = v_div(object.forces, object.mass);
	}
	return v_add(v_add(object.center, velocity), v_mul(acceleration, delta_t*delta_t));
};


/////////////////////////////////////////////////
//////////////// UI HELPERS ////////////////////
///////////////////////////////////////////////


var add_planet = function(){
	var sphere1 = make_sphere(.3, [0.0,0.0,5.0], 8.0, 16.0, .7, [0.0,0.0,5.0]);
	scene_objects.push(sphere1);
	assign_objects();
}



//rotate camera around origin theta degrees down from starting point, and fe degrees left from starting point
var update_view = function(theta, fe){
	let r = distance(cam_location, cam_look_at);
	let current_fe = find_fe(cam_look_at, cam_location);
	let current_theta = find_theta(cam_look_at, cam_location);

	let new_theta = current_theta + theta;
	let new_fe = current_fe + fe;
	if(new_theta > Math.PI){
		new_theta = current_theta
		new_fe = current_fe
	}
	let new_direction = unit_from_theta_fe(new_theta, new_fe);
	cam_location = v_mul(new_direction, r);
	mat4.lookAt(view_matrix, cam_location, cam_look_at, [0,1,0]);
	gl.uniformMatrix4fv(view_uniform_location, gl.FALSE, view_matrix);
}

function mousedown(event) {
	if(mousedownID==-1)  //Prevent multimple loops!
		mousedownID = 1;
		original_x = event.clientX; 
		original_y = event.clientY;
		last_x_position = original_x;
		last_y_position = original_y;
		canvas.addEventListener("mousemove", drag);
}
function mouseup(event) {
	console.log("??");
	if(mousedownID!=-1) {  //Only stop if exists
		clearInterval(mousedownID);
		mousedownID=-1;
		console.log("here");
		canvas.removeEventListener("mousemove", drag)
	}

}

function drag() {
   let x = event.clientX; 
   let y = event.clientY;

   if(original_x < x & !(last_x_position < x) || original_x > x & !(last_x_position > x)){
   		original_x = last_x_position;
   }
   if(original_y < y & !(last_x_position < y) || original_y > y & !(last_y_position > y)){
   		original_y = last_y_position;
   }
   let x_dis = original_x - x; // left right
   let y_dis = original_y - y; // top bottom

   let fe = (x_dis / canvas.clientWidth)*FOV;
   let theta = (y_dis / canvas.clientHeight)*FOV;
   update_view(theta, fe);

   last_x_position = x;
   last_y_position = y
}
//////////////////////////////////////////////
//////////// WEBGL BASE //////////////////////
/////////////////////////////////////////////

var assign_objects = function(){
	var traingleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

	gl.vertexAttribPointer(
		positionAttribLocation, //Attribute location
		3, //number of elements per attribute
		gl.FLOAT, //type of elements
		gl.FALSE, //no idea what this does
		6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
		0 // Offset from the beginning of a Math.single vertex to this attribute 
	);

	gl.vertexAttribPointer(
		colorAttribLocation, //Attribute location
		3, //number of elements per attribute
		gl.FLOAT, //type of elements
		gl.FALSE, //no idea what this does
		6 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a Math.single vertex to this attribute 
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
}

var runtime_loop = function() {

	var identity_matrix = new Float32Array(16);
	mat4.identity(identity_matrix);
	gl.enable(gl.DEPTH_TEST);
	var stop = false;

	// if we restart the demo, the old loop will keep running and our simulation will go twice as fast
	// in order to combat this, we add this variable which stops the current simulation
	document.getElementById("restart_button").addEventListener("click", function(){
		stop = true;
		console.log("false")
	});

	var loop = function() {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		var vertices_so_far = 0
		for(var object_ind = 0; object_ind < scene_objects.length; ++object_ind){
			let object = scene_objects[object_ind];
			calculate_forces(object, scene_objects);
			let old_center = object.center;
			object.new_center = calculate_new_position(object, .1);
			object.last_position = old_center;

			//			      input         original matrix  vector to translate by
			mat4.translate(world_matrix, identity_matrix, object.center);
			gl.uniformMatrix4fv(world_uniform_location, gl.FALSE, world_matrix);

			gl.drawArrays(gl.TRIANGLES, vertices_so_far , object.num_vertices);
			vertices_so_far += object.num_vertices;
		}
		for(var object_ind = 0; object_ind < scene_objects.length; ++object_ind){
			scene_objects[object_ind].center = scene_objects[object_ind].new_center;
		}

		if(!stop){
			requestAnimationFrame(loop);
		}
	};

	if(!stop){
		requestAnimationFrame(loop);
	}
}

var InitDemo = function(){

	canvas = document.getElementById('render_canvas');
	gl = canvas.getContext('webgl');

	if (!gl){
		console.log("Your browser does not support WebGL");
	}

	//
	// setting the 'blank' color to be black instead of white
	// updating the screen
	//
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var vertexShaderSrc = document.getElementById("vertex_shader").text;

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	var fragmentShaderSrc = document.getElementById("fragment_shader").text;

	gl.shaderSource(vertexShader, vertexShaderSrc);
	gl.shaderSource(fragmentShader, fragmentShaderSrc);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
		return;
	}

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error("ERROR linking program!", gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program)
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		consol.error("ERROR validating program!", gl.getProgramInfoLog(program));
		return;
	}

	//
	// create buffer
	//

	triangleVertices = []; // these will be global
	scene_objects = []; // these will be global
	stop = true;

	var sphere1 = make_sphere(.5, [0.5,0.0,0.0], 8.0, 16.0, .7, [0.5,0.0,0.0]);
	scene_objects.push(sphere1);

	var sphere2 = make_sphere(.25, [-1.5,0.0,0.0], 8.0, 8.0, .05, [-1.5,0.0,.06]);
	scene_objects.push(sphere2);

	var sphere2 = make_sphere(.15, [3.5,0.0,0.0], 8.0, 8.0, .02, [3.5,0.0,-.04]);
	scene_objects.push(sphere2);

	assign_objects();
	// tell open GL what program we're uMath.sing
	gl.useProgram(program);


	//creating pointers
	world_uniform_location = gl.getUniformLocation(program, 'world_matrix_render');
	view_uniform_location = gl.getUniformLocation(program, 'view_matrix_render');
	projection_uniform_location = gl.getUniformLocation(program, 'projection_matrix_render');

	//setting the values in the CPU of matrices
	world_matrix = new Float32Array(16);
	view_matrix = new Float32Array(16);
	projection_matrix = new Float32Array(16);

	mat4.identity(world_matrix);

	cam_location = [0.0,0.0,-5.0];
	cam_look_at = [0.0,0.0,0.0];
	camera_up = [0,1,0]
	FOV = glMatrix.toRadian(90)
	mat4.lookAt(view_matrix, cam_location, cam_look_at, camera_up); // camera: location, position looking at, direction, that it up

	mat4.perspective(projection_matrix, glMatrix.toRadian(90), canvas.clientWidth/canvas.clientHeight, 0.1, 1000.0); // fov in rad, aspect ratio width/height, near plane and far plane; 

	//sending to shader
	gl.uniformMatrix4fv(world_uniform_location, gl.FALSE, world_matrix); //uniform matrix of floats. gl.FALSE just indicates that we don't want the transpose
	gl.uniformMatrix4fv(view_uniform_location, gl.FALSE, view_matrix);
	gl.uniformMatrix4fv(projection_uniform_location, gl.FALSE, projection_matrix);

	//
	// Main render loop
	//
	stop = false;
	runtime_loop();

};

///////////////////////////////
/// EVENT HANDLERS ///////////
/////////////////////////////
var can = document.getElementById("render_canvas");
can.addEventListener("mousedown", mousedown);
can.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
can.addEventListener("mouseout", mouseup);
