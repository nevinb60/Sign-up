// Get canvas and initialize WebGL
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");
if (!gl) {
    alert("WebGL is not supported by your browser.");
}
// Resize canvas to fill window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Vertex shader: draws a full-screen quad and passes UV coordinates.
const vertexShaderSource = `
   attribute vec2 a_position;
   varying vec2 v_uv;
   void main() {
     v_uv = a_position * 0.5 + 0.5;
     gl_Position = vec4(a_position, 0.0, 1.0);
   }
 `;

// Fragment shader: creates two gradients from opposite sides and blends them,
// with a flickering effect that makes it feel like a dancing candle flame.
//
// Colors used:
//   #F9ED69, #F08A5D, #B83B5E, #6A2C70
const fragmentShaderSource = `
   precision mediump float;
   uniform vec2 u_resolution;
   uniform float u_time;
   varying vec2 v_uv;
   
   // Convert hex colors to normalized RGB:
   vec3 colA = vec3(249.0/255.0, 237.0/255.0, 105.0/255.0); // #F9ED69
   vec3 colB = vec3(240.0/255.0, 138.0/255.0, 93.0/255.0);  // #F08A5D
   vec3 colC = vec3(184.0/255.0, 59.0/255.0, 94.0/255.0);   // #B83B5E
   vec3 colD = vec3(106.0/255.0, 44.0/255.0, 112.0/255.0);  // #6A2C70
   
   void main() {
     // Normalize pixel coordinate (0 to 1)
     vec2 st = gl_FragCoord.xy / u_resolution.xy;
     
     // Compute a base wave factor using time (sped up by using 0.75 instead of 0.5)
     float wave = sin(u_time * 0.75 + st.x * 5.0) * 0.5 + 0.5;
     // Add a faster-varying flicker (simulating a dancing flame)
     float flicker = sin(u_time * 3.0 + st.y * 10.0) * 0.1;
     wave = clamp(wave + flicker, 0.0, 1.0);
     
     // Create two gradients:
     // Left gradient: vertical blend from colA to colB
     vec3 leftGradient = mix(colA, colB, st.y);
     // Right gradient: vertical blend from colC to colD
     vec3 rightGradient = mix(colC, colD, st.y);
     
     // Blend the two gradients along the x-axis.
     // The mix factor uses a smoothstep over a shifted x-coordinate,
     // modulated by the wave value.
     float mixFactor = smoothstep(0.3, 0.7, st.x + wave * 0.2);
     vec3 finalColor = mix(leftGradient, rightGradient, mixFactor);
     
     gl_FragColor = vec4(finalColor, 1.0);
   }
 `;

// Utility function to compile a shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create and compile the shaders
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

// Link the shaders into a program and use it
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
}
gl.useProgram(program);

// Set up a full-screen quad
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Two triangles covering the screen
const positions = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Look up uniform locations
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
const timeLocation = gl.getUniformLocation(program, "u_time");

// Animation loop: update time and draw the quad
const startTime = performance.now();
function render() {
    const elapsedTime = (performance.now() - startTime) / 1000.0;
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, elapsedTime);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);