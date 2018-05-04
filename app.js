var mousedownID = -1;  //indicates if mouse is down
var angle_or_pan = 1; //indicates dragging will angle camera instead of pan
var angle_mode = true;

var make_sphere = function(r, center, num_lat, num_lon, mass, last_position, moving=true){
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
					new_center:center,
					moving:moving
				};
	return object;
};


////////////////////////////////////////////////////
//////////// ALGEBRA HELPERS //////////////////////
//////////////////////////////////////////////////

var mat_vec_mul = function(m, v){
	return([  v_dot([m[0], m[1], m[2]],v), v_dot([m[3], m[4], m[5]],v), v_dot([m[6], m[7], m[8]],v)  ])
}

var cross = function(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

var v_add = function(v1, v2){
	return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};

var v_add_nine = function(v1, v2, v3){
	return [v1[0] + v2[0] + v3[0], 
			v1[1] + v2[1] + v3[1], 
			v1[2] + v2[2] + v3[2], 
			v1[3] + v2[3] + v3[3], 
			v1[4] + v2[4] + v3[4],
			v1[5] + v2[5] + v3[5],
			v1[6] + v2[6] + v3[6],
			v1[7] + v2[7] + v3[7], 
			v1[8] + v2[8] + v3[8]];
}

var v_sub = function(v1, v2){
	return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

var v_div = function(v, n){
	return [v[0]/n, v[1]/n, v[2]/n];
}

var v_mul = function(v, n){
	if(v.length == 3){
		return [v[0]*n, v[1]*n, v[2]*n];
	}
	else{
		return [v[0]*n, v[1]*n, v[2]*n, v[3]*n, v[4]*n, v[5]*n, v[6]*n, v[7]*n, v[8]*n];
	}
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

var v_outer = function(v1, v2) {
	return [v1[0]*v2[0], v1[0]*v2[1], v1[0]*v2[2], v1[1]*v2[0], v1[1]*v2[1], v1[1]*v2[2], v1[2]*v2[0], v1[2]*v2[1], v1[2]*v2[2]]
}

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

var rotate_around_axis = function(a, n) {
	return v_add_nine(v_mul([1, 0, 0, 0, 1, 0, 0, 0, 1], Math.cos(a)), v_mul(v_outer(n, n), (1.0 - Math.cos(a))), v_mul([0, -n[2], n[1], n[2], 0, -n[0], -n[1], n[0], 0], Math.sin(a)));
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

var ease = function(t){
	return t * t * (3.0 - 2.0 * t);
}


/////////////////////////////////////////////////
//////////////// UI HELPERS ////////////////////
///////////////////////////////////////////////
var switch_to_pan = function(){
	angle_or_pan = -1;
}

var switch_to_angle = function(){
	angle_or_pan = 1;
}

var switch_add_or_move = function() {
	angle_mode = !angle_mode;
}

var add_planet = function(x_angle = 0, y_angle = 0, power = 0.05){ //rotate_around_axis(a, n)
	if(power < 0.01) {
		power = 0.01;
	}
	let direction = v_div(v_sub(cam_location,cam_look_at) , distance(cam_location,cam_look_at) );
	var x_rotate_matrix = rotate_around_axis(x_angle, camera_up);
	var camera_horizontal = vec3
	cross(camera_horizontal, camera_up, direction)
	var y_rotate_matrix = rotate_around_axis(y_angle, camera_horizontal);

	direction = mat_vec_mul(x_rotate_matrix, direction)
	direction = mat_vec_mul(y_rotate_matrix, direction)
	
	planetRadius = document.getElementById("planetRadius").value / 100;
	planetMass = document.getElementById("planetMass").value / 100;
	
	stationary = document.getElementById("isStationary").checked

	var sphere1 = make_sphere(planetRadius, v_add(cam_location, v_mul(direction, -planetRadius * 2)), 8.0, 16.0, planetMass, v_add(v_add(cam_location, v_mul(direction, power)), v_mul(direction, -planetRadius * 2)), !stationary); //r, center, num_lat, num_lon, mass, last_position, can move
	scene_objects.push(sphere1);
	assign_objects();
}

//rotate camera around origin theta degrees down from starting point, and fe degrees left from starting point
var update_view_angle = function(theta, fe){
	let current_fe = find_fe(cam_look_at, cam_location);
	let current_theta = find_theta(cam_look_at, cam_location);

	let new_theta = current_theta + theta;
	let new_fe = current_fe + fe;
	if(new_theta > Math.PI || new_theta < .05){
		new_theta = current_theta
	}
	let new_direction = unit_from_theta_fe(new_theta, new_fe);
	cam_location = v_add(cam_look_at, v_mul(new_direction, cam_radius));
	camera_up = unit_from_theta_fe((Math.PI / 2.0) - new_theta, Math.PI + new_fe);
	mat4.lookAt(view_matrix, cam_location, cam_look_at, camera_up);
	gl.uniformMatrix4fv(view_uniform_location, gl.FALSE, view_matrix);
}

function mousedown(event) {
	if(mousedownID==-1)  //Prevent multimple loops!

		if(angle_mode){ // we will angle our viewpoint
			mousedownID = 1;

			original_x = event.clientX; 
			original_y = event.clientY;
			last_x_position = original_x;
			last_y_position = original_y;
			if(angle_or_pan == 1){
				canvas_div.addEventListener("mousemove", drag_angle);
			}else{
				canvas_div.addEventListener("mousemove", drag_pan);
			}
		} else{ //we will shoot a planet
			mousedownID = 1;
			mousedown_time = new Date();
			mouse_x = event.clientX
			mouse_y = event.clientY
			canvas_div.addEventListener("mousemove", target_move);
		
			var pointer = document.getElementById("fire_pointer");
			pointer.style.left = mouse_x - 30 + "px";
			pointer.style.top = mouse_y - 30 + "px";
			pointer.style.display = "block"

			var small_pointer = document.getElementById("fire_pointer_small");
			small_pointer.style.width = "0px";
			small_pointer.style.height = "0px";
			small_pointer.style.left = mouse_x + "px";
			small_pointer.style.top = mouse_y + "px";
			small_pointer.style.display = "block"

			intervalTarget = setInterval(whilemousedown, 20);
		}
}
function mouseup(event) {
	if(mousedownID!=-1) {  //Only stop if exists
		clearInterval(mousedownID);
		mousedownID=-1;
		if(angle_mode){
			if(angle_or_pan == 1){
				canvas_div.removeEventListener("mousemove", drag_angle);
			}else{
				canvas_div.removeEventListener("mousemove", drag_pan);	
			}
		} else{
			clearInterval(intervalTarget);
			var element = document.getElementById("fire_pointer");
			element.style.display = "None"
			var element = document.getElementById("fire_pointer_small");
			element.style.display = "None"
			canvas_div.removeEventListener("mousemove", target_move);	

			mouseup_time = new Date();
			var power = (mouseup_time - mousedown_time) / 2000;
			if(power > 1) {
				power = 1;
			}
			if(power < 0) {
				power = 0;
			}
			let x = event.clientX; 
			let y = event.clientY;
			var x_angle = ((x/canvas.clientWidth) * FOV) - (FOV/2)
			var y_angle = ((y/canvas.clientHeight) * FOV) - (FOV/2)
			add_planet(-x_angle, -y_angle, ease(power) / 4);
		}
	}

}

function whilemousedown(){
	var t = new Date();
	var power = (t - mousedown_time) / 2000;
	if(power > 1) {
		power = 1;
	}
	if(power < 0) {
		power = 0;
	}
	power = ease(power)
	
	var pointer = document.getElementById("fire_pointer");
	pointer.style.left = mouse_x - 30 + "px";
	pointer.style.top = mouse_y - 30 + "px";
	
	var small_pointer = document.getElementById("fire_pointer_small");
	small_pointer.style.width = power*62 + "px";
	small_pointer.style.height = power*62 + "px";
	small_pointer.style.left = mouse_x - power*30 + 2 + "px";
	small_pointer.style.top = mouse_y - power*30 + 2 + "px";
	small_pointer.style.display = "block"
}

function keydown(event) {
	
	speed = document.getElementById("cameraSpeed").value / 100;

	if(event.keyCode == 37){ //left arrow
		left(speed);
	}
	if(event.keyCode == 38){ //up arrow
		up(speed);
	}
	if(event.keyCode == 39){ //right arrow
		right(speed);
	}
	if(event.keyCode == 40){ //down arrow
		down(speed);
	}
	if(event.keyCode == 87){ //w key
		forward(speed);
	}
	if(event.keyCode == 83){ //s key
		backward(speed);
	}

}

function target_move() {
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

function drag_angle() {
   let x = event.clientX; 
   let y = event.clientY;

   if(original_x < x & !(last_x_position < x) || original_x > x & !(last_x_position > x)){
   		original_x = last_x_position;
   }
   if(original_y < y & !(last_y_position < y) || original_y > y & !(last_y_position > y)){
   		original_y = last_y_position;
   }
   let x_dis = original_x - x; // left right
   let y_dis = original_y - y; // top bottom

   let fe = (x_dis / canvas.clientWidth)*FOV*.25;
   let theta = (y_dis / canvas.clientHeight)*FOV*.25;
   update_view_angle(theta, fe);

   last_x_position = x;
   last_y_position = y;
}

function drag_pan(){
   let x = event.clientX; 
   let y = event.clientY;

   if(original_x < x & !(last_x_position < x) || original_x > x & !(last_x_position > x)){
   		original_x = last_x_position;
   }
   if(original_y < y & !(last_y_position < y) || original_y > y & !(last_y_position > y)){
   		original_y = last_y_position;
   }
   let x_dis = original_x - x; // left right
   let y_dis = original_y - y; // top bottom

   var left_right_dir = [0.0,0.0,0.0];
   cross(left_right_dir, camera_up, v_sub(cam_look_at, cam_location));
   left_right_dir = v_div(left_right_dir, distance([0.0,0.0,0.0], left_right_dir))
   var up_down_dir = v_div(camera_up, distance([0.0,0.0,0.0], camera_up));

   var direction_to_move = v_add(v_mul(left_right_dir, (x_dis/ canvas.clientWidth)),v_mul(up_down_dir, (y_dis/canvas.clientHeight))); 
   update_view_pan(direction_to_move[0], direction_to_move[1], direction_to_move[2]);
}

function forward(amount){
	let forward_direction = v_sub(cam_look_at, cam_location);
	forward_direction = v_div(forward_direction, distance(forward_direction, [0.0,0.0,0.0]));
	update_view_pan(amount*forward_direction[0], amount*forward_direction[1], amount*forward_direction[2])
}

function backward(amount){
	let forward_direction = v_sub(cam_look_at, cam_location);
	forward_direction = v_div(forward_direction, distance(forward_direction, [0.0,0.0,0.0]));
	update_view_pan(amount*-1.0* forward_direction[0], amount*-1.0*forward_direction[1], amount*-1.0*forward_direction[2])
}

function left(amount){
   var left_right_dir = [0.0,0.0,0.0];
   cross(left_right_dir, camera_up, v_sub(cam_look_at, cam_location));
   left_right_dir = v_div(left_right_dir, distance([0.0,0.0,0.0], left_right_dir));
   update_view_pan(amount*left_right_dir[0], amount*left_right_dir[1], amount*left_right_dir[2]);
}

function right(amount){
   var left_right_dir = [0.0,0.0,0.0];
   cross(left_right_dir, camera_up, v_sub(cam_look_at, cam_location));
   left_right_dir = v_div(left_right_dir, distance([0.0,0.0,0.0], left_right_dir));
   update_view_pan(amount*-1.0*left_right_dir[0], amount*-1.0*left_right_dir[1], amount*-1.0*left_right_dir[2]);

}

function up(amount){
   var up_down_dir = camera_up;
   up_down_dir = v_div(up_down_dir, distance([0.0,0.0,0.0], up_down_dir));
   update_view_pan(amount*up_down_dir[0], amount*up_down_dir[1], amount*up_down_dir[2]);

}

function down(amount){
   var up_down_dir = camera_up;
   up_down_dir = v_div(up_down_dir, distance([0.0,0.0,0.0], up_down_dir));
   update_view_pan(amount*-1.0*up_down_dir[0], amount*-1.0*up_down_dir[1], amount*-1.0*up_down_dir[2]);

}
function update_view_pan(x, y, z) {
	cam_look_at = v_add(cam_look_at, [x,y,z]);

	let current_fe = find_fe(cam_look_at, cam_location);
	let current_theta = find_theta(cam_look_at, cam_location);

	let direction = unit_from_theta_fe(current_theta, current_fe);
	cam_location = v_add(cam_look_at, v_mul(direction, cam_radius));
	mat4.lookAt(view_matrix, cam_location, cam_look_at, camera_up);
	gl.uniformMatrix4fv(view_uniform_location, gl.FALSE, view_matrix);
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
			if(scene_objects[object_ind].moving){ 
				scene_objects[object_ind].center = scene_objects[object_ind].new_center;
			}
		}

		if(!stop){
			requestAnimationFrame(loop);
		}
	};

	if(!stop){
		requestAnimationFrame(loop);
	}
}

var InitDemo = function(stationary = false){

	canvas = document.getElementById('render_canvas');
	canvas_div = document.getElementById("canvas_div");
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

	var sphere1 = make_sphere(.5, [0.0,0.0,0.0], 8.0, 16.0, .7, [0.0,0.0,0.0], !stationary);
	scene_objects.push(sphere1);

	var sphere2 = make_sphere(.25, [-1.5,0.0,0.0], 8.0, 8.0, .05, [-1.5,0.0,.08]);
	scene_objects.push(sphere2);

	var sphere3 = make_sphere(.15, [3.5,0.0,0.0], 8.0, 8.0, .02, [3.5,0.0,-.04]);
	scene_objects.push(sphere3);

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

	cam_location = [0.0,5.0,-5.0];
	cam_look_at = [0.0,0.0,0.0];
	camera_up = [0,1,0]
	cam_radius = distance(cam_location, cam_look_at);
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

var can = document.getElementById("canvas_div");
can.addEventListener("mousedown", mousedown);
can.addEventListener("mouseup", mouseup);
//Also clear the interval when user leaves the window with mouse
can.addEventListener("mouseout", mouseup);
document.addEventListener('keydown', keydown);