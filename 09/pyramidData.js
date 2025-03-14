"use strict";

var canvas;
var gl;

var theta = [ 0, 0, 0 ];
var thetaLoc;

var points = [];
var colors = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    var myPyramid =  pyramid();
    
    myPyramid.scale(0.5, 0.5, 0.5);
    myPyramid.rotate(45, [1, 1, 1]);
    myPyramid.translate(0.5, 0.5, 0.0);

    colors = myPyramid.TriangleVertexColors;
    points = myPyramid.TriangleVertices;
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    thetaLoc = gl.getUniformLocation(program, "theta");

    // 🎛️ 슬라이더 이벤트 리스너 추가
    document.getElementById("xSlider").oninput = function () {
        theta[0] = parseFloat(this.value);
    };
    document.getElementById("ySlider").oninput = function () {
        theta[1] = parseFloat(this.value);
    };
    document.getElementById("zSlider").oninput = function () {
        theta[2] = parseFloat(this.value);
    };

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, points.length);
    requestAnimationFrame( render );
}
