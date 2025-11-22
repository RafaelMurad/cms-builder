"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/**
 * WEBGL & THREE.JS BASICS LEARNING MODULE
 *
 * Introduction to 3D graphics on the web with basic WebGL concepts.
 * This module covers the fundamentals without requiring Three.js installation.
 */

export default function WebGLBasicsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("#4f46e5");
  const animationRef = useRef<number | null>(null);

  // Simple WebGL rotating square demo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader - positions vertices
    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform float u_rotation;

      void main() {
        float cos_r = cos(u_rotation);
        float sin_r = sin(u_rotation);

        vec2 rotated = vec2(
          a_position.x * cos_r - a_position.y * sin_r,
          a_position.x * sin_r + a_position.y * cos_r
        );

        gl_Position = vec4(rotated * 0.5, 0.0, 1.0);
      }
    `;

    // Fragment shader - colors pixels
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 u_color;

      void main() {
        gl_FragColor = vec4(u_color, 1.0);
      }
    `;

    // Compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    // Create program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up geometry (square)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const rotationLocation = gl.getUniformLocation(program, "u_rotation");
    const colorLocation = gl.getUniformLocation(program, "u_color");

    // Animation loop
    let currentRotation = 0;

    function render() {
      if (!gl) return;

      currentRotation += 0.01;
      setRotation(currentRotation);

      // Parse hex color to RGB
      const hex = color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;

      // Clear and draw
      gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(rotationLocation, currentRotation);
      gl.uniform3f(colorLocation, r, g, b);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/learn" className="text-neutral-400 hover:text-white text-sm mb-4 inline-block">
            ← Back to Learning Lab
          </Link>
          <h1 className="text-4xl font-light">WebGL & Three.js Basics</h1>
          <p className="text-neutral-400 mt-2">Introduction to 3D graphics on the web</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8">
        {/* WebGL Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6">Interactive WebGL Demo</h2>
          <p className="text-neutral-400 mb-8">
            This rotating square is rendered using raw WebGL - the same technology that powers Three.js.
            Change the color to see the shader update in real-time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full aspect-square"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 cursor-pointer rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Rotation</label>
                <div className="text-2xl font-mono">
                  {(rotation % (Math.PI * 2)).toFixed(2)} rad
                </div>
              </div>

              <div className="bg-neutral-800 p-4 rounded">
                <h4 className="text-sm font-medium mb-2">What&apos;s happening:</h4>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• GPU renders 60 frames per second</li>
                  <li>• Vertex shader rotates each corner</li>
                  <li>• Fragment shader applies color</li>
                  <li>• All math runs on your graphics card</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Concepts */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6">Core WebGL Concepts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Vertex Shader</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Runs once per vertex (corner). Positions points in 3D space.
              </p>
              <pre className="bg-black text-green-400 p-3 text-xs overflow-x-auto rounded">
{`// Runs for EACH vertex
attribute vec2 a_position;

void main() {
  // Transform position
  gl_Position = vec4(
    a_position,
    0.0, 1.0
  );
}`}
              </pre>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Fragment Shader</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Runs once per pixel. Determines the final color.
              </p>
              <pre className="bg-black text-green-400 p-3 text-xs overflow-x-auto rounded">
{`// Runs for EACH pixel
precision mediump float;
uniform vec3 u_color;

void main() {
  // Set pixel color (RGBA)
  gl_FragColor = vec4(
    u_color, 1.0
  );
}`}
              </pre>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Buffers</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Store geometry data (positions, colors, UVs) on the GPU.
              </p>
              <pre className="bg-black text-green-400 p-3 text-xs overflow-x-auto rounded">
{`// Square vertices
const positions = [
  -1, -1,  // bottom-left
   1, -1,  // bottom-right
  -1,  1,  // top-left
   1,  1,  // top-right
];

// Send to GPU
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(positions),
  gl.STATIC_DRAW
);`}
              </pre>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Uniforms</h3>
              <p className="text-neutral-400 text-sm mb-4">
                Values passed to shaders that stay constant per draw call.
              </p>
              <pre className="bg-black text-green-400 p-3 text-xs overflow-x-auto rounded">
{`// In shader
uniform float u_time;
uniform vec3 u_color;

// In JavaScript
gl.uniform1f(
  timeLocation,
  performance.now()
);
gl.uniform3f(
  colorLocation,
  1.0, 0.0, 0.0 // red
);`}
              </pre>
            </div>
          </div>
        </section>

        {/* Three.js Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6">Why Use Three.js?</h2>
          <p className="text-neutral-400 mb-8">
            Three.js abstracts away the complexity of raw WebGL while providing powerful features.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-red-400">Raw WebGL (Complex)</h3>
              <pre className="bg-black text-neutral-400 p-3 text-xs overflow-x-auto rounded">
{`// 50+ lines just for a rotating cube
const gl = canvas.getContext('webgl');
const vertexShader = gl.createShader(...);
gl.shaderSource(vertexShader, ...);
gl.compileShader(vertexShader);
// ... many more lines ...`}
              </pre>
            </div>

            <div className="bg-neutral-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-400">Three.js (Simple)</h3>
              <pre className="bg-black text-green-400 p-3 text-xs overflow-x-auto rounded">
{`// Same result in ~10 lines
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
);
scene.add(cube);`}
              </pre>
            </div>
          </div>
        </section>

        {/* Learning Path */}
        <section>
          <h2 className="text-2xl font-light mb-6">Learning Path</h2>
          <div className="bg-neutral-800 p-6 rounded-lg">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="text-2xl font-bold text-neutral-600">1</span>
                <div>
                  <h4 className="font-medium">Start with Three.js</h4>
                  <p className="text-neutral-400 text-sm">Don&apos;t learn raw WebGL first - Three.js is more practical.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl font-bold text-neutral-600">2</span>
                <div>
                  <h4 className="font-medium">Learn 3D Fundamentals</h4>
                  <p className="text-neutral-400 text-sm">Cameras, lighting, materials, and geometry.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl font-bold text-neutral-600">3</span>
                <div>
                  <h4 className="font-medium">Custom Shaders</h4>
                  <p className="text-neutral-400 text-sm">GLSL shaders for unique effects (where WebGL knowledge helps).</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl font-bold text-neutral-600">4</span>
                <div>
                  <h4 className="font-medium">React Three Fiber</h4>
                  <p className="text-neutral-400 text-sm">Three.js with React&apos;s declarative style.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}
