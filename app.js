var InitDemo = function(){

	var canvas = document.getElementById('render_canvas');
	var gl = canvas.getContext('webgl');

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

	var program = gl.createProgram();
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

	var triangleVertices = [];

	var num_lat = 8.0;
	var num_lon = 16.0;
	var center = [0.0, 0.0, 0.0];
	var vertices = [];
	var r = 1.0;

	for (let lat = 1.0; lat <= num_lat + 1.0; ++lat) {
		for (let lon = 0.0; lon < num_lon; ++lon) {
			let a1 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a2 = (lon / (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x00 = center[0] + (r * Math.sin(a2) * Math.sin(a1));
			let y00 = center[1] + (r * Math.cos(a1));
			let z00 = center[2] + (r * Math.sin(a1) * Math.cos(a2));


			let a3 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a4 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x10 = center[0] + (r * Math.sin(a4) * Math.sin(a3));
			let y10 = center[1] + (r * Math.cos(a3));
			let z10 = center[2] + (r * Math.sin(a3) * Math.cos(a4));


			let a5 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a6 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x11 = center[0] + (r * Math.sin(a6) * Math.sin(a5));
			let y11 = center[1] + (r * Math.cos(a5));
			let z11 = center[2] + (r * Math.sin(a5) * Math.cos(a6));


			let a7 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a8 = ((lon)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x01 = center[0] + (r * Math.sin(a8) * Math.sin(a7));
			let y01 = center[1] + (r * Math.cos(a7));
			let z01 = center[2] + (r * Math.sin(a7) * Math.cos(a8));

/*					console.log(a1, a2, a3, a4, a5, a6, a7, a8);
			console.log(x00, y00, z00);
			console.log(x10, y10, z10);
			console.log(x11, y11, z11);
			console.log(x01, y01, z01);*/


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

		}
	}

/*	var triangleVertices = 
	[ // X  ,  Y  ,  Z     R,   G,   B
		 0.0,  0.5, 0.0,   1.0, 1.0, 0.0,
		-0.5, -0.5, 0.0,   0.7, 0.0, 1.0,
		 0.5, -0.5, 0.0,   0.0, 0.7, 1.0,

		-0.7,  0.2, 0.0,   1.0, 1.0, 0.0,
		-0.9, -0.2, 0.0,   0.7, 0.0, 1.0,
		-0.5, -0.2, 0.0,   0.0, 0.7, 1.0 
	];*/

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

	// tell open GL what program we're uMath.sing
	gl.useProgram(program);


	//creating pointers
	var world_uniform_location = gl.getUniformLocation(program, 'world_matrix_render');
	var view_uniform_location = gl.getUniformLocation(program, 'view_matrix_render');
	var projection_uniform_location = gl.getUniformLocation(program, 'projection_matrix_render');

	//setting the values in the CPU of matrices
	var world_matrix = new Float32Array(16);
	var view_matrix = new Float32Array(16);
	var projection_matrix = new Float32Array(16);
	mat4.identity(world_matrix);
	mat4.lookAt(view_matrix, [0,-2,-5], [0,0,0], [0,1,0]); // camera: location, position looking at, direction, that it up
	mat4.perspective(projection_matrix, glMatrix.toRadian(45), canvas.clientWidth/canvas.clientHeight, 0.1, 1000.0) // fov in rad, aspect ratio width/height, near plane and far plane; 

	//sending to shader
	gl.uniformMatrix4fv(world_uniform_location, gl.FALSE, world_matrix); //uniform matrix of floats. gl.FALSE just indicates that we don't want the transpose
	gl.uniformMatrix4fv(view_uniform_location, gl.FALSE, view_matrix);
	gl.uniformMatrix4fv(projection_uniform_location, gl.FALSE, projection_matrix);

	//
	// Main render loop
	//
	var identity_matrix = new Float32Array(16);
	mat4.identity(identity_matrix);
	var angle = 0;
	gl.enable(gl.DEPTH_TEST);
	var loop = function() {
		//		mil Math.since start   to secs     one full rotation per six seconds 
		angle = performance.now() / 1000     / 6 * 2 * Math.PI;
		//			input         original matrix  angle   axis
		mat4.rotate(world_matrix, identity_matrix, angle, [0,1,0]);
		gl.uniformMatrix4fv(world_uniform_location, gl.FALSE, world_matrix);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0 , 864);

		requestAnimationFrame(loop)
	};
	//this will run the loop every time the screen is ready to refresh
	requestAnimationFrame(loop);

};

var getSphere = function(){
	var num_lat = 3.0;
	var num_lon = 3.0;
	var center = [0.0, 0.0, 0.0];
	var vertices = [];

	for (let lat = 1.0; lat <= num_lat; ++lat) {
		for (let lon = 0.0; lon < num_lon; ++lon) {
			let a1 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a2 = (lon / (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x00 = center + (r * Math.sin(a2) * Math.cos(a1));
			let y00 = center + (r * Math.cos(a1));
			let z00 = center + (r * Math.sin(a1) * Math.cos(a2));


			let a3 = (lat / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a4 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x10 = center + (r * Math.sin(a4) * Math.cos(a3));
			let y10 = center + (r * Math.cos(a3));
			let z10 = center + (r * Math.sin(a3) * Math.cos(a4));


			let a5 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a6 = ((lon + 1.0)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x11 = center + (r * Math.sin(a6) * Math.cos(a5));
			let y11 = center + (r * Math.cos(a5));
			let z11 = center + (r * Math.sin(a5) * Math.cos(a6));


			let a7 = ((lat-1.0) / (num_lat + 1)) * Math.PI; //radians away from straight up
			let a8 = ((lon)/ (num_lon)) * Math.PI * 2.0; //radians aorund circle

			let x01 = center + (r * Math.sin(a8) * Math.cos(a7));
			let y01 = center + (r * Math.cos(a7));
			let z01 = center + (r * Math.sin(a7) * Math.cos(a8));
		}
	}
};