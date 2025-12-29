import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Stars, Text, Html } from '@react-three/drei';

function Node({ node, isHovered, onHover, onUnhover }) {
  return (
    <group 
      position={[node.x / 10, node.y / 10, node.z / 10]}
      onPointerOver={(e) => { e.stopPropagation(); onHover(node.id); }}
      onPointerOut={() => onUnhover()}
    >
      <Sphere args={[isHovered ? 0.8 : 0.5, 32, 32]}>
        <meshStandardMaterial 
          color={isHovered ? "#ff006e" : "#3a86ff"} 
          emissive={isHovered ? "#ff006e" : "#3a86ff"} 
          emissiveIntensity={isHovered ? 2 : 0.5} 
        />
      </Sphere>
      <Text position={[0, 1, 0]} fontSize={0.4} color="white" anchorX="center">
        {node.name}
      </Text>
    </group>
  );
}

function BrainScene({ threshold }) {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5002/api/graph')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Filter edges based on the UI slider threshold
  const filteredEdges = useMemo(() => {
    return data.edges.filter(edge => edge.weight >= threshold);
  }, [data.edges, threshold]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {data.nodes.map((node) => (
        <Node 
          key={node.id} 
          node={node} 
          isHovered={hoveredNode === node.id}
          onHover={setHoveredNode}
          onUnhover={() => setHoveredNode(null)}
        />
      ))}

      {filteredEdges.map((edge, idx) => {
        const start = data.nodes[edge.source];
        const end = data.nodes[edge.target];
        if (!start || !end) return null;

        return (
          <Line
            key={idx}
            points={[
              [start.x / 10, start.y / 10, start.z / 10],
              [end.x / 10, end.y / 10, end.z / 10],
            ]}
            color={hoveredNode === edge.source || hoveredNode === edge.target ? "#ff006e" : "white"}
            lineWidth={edge.weight * 3}
            transparent
            opacity={0.6}
          />
        );
      })}
    </>
  );
}

export default function App() {
  const [threshold, setThreshold] = useState(0.5);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      {/* UI Overlay */}
      <div style={{ 
        position: 'absolute', top: '20px', left: '20px', zIndex: 10, 
        background: 'rgba(255, 255, 255, 0.1)', padding: '15px', 
        borderRadius: '10px', color: 'white', backdropFilter: 'blur(5px)' 
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Connectivity Controls</h3>
        <label>Min Strength: {threshold.toFixed(2)}</label><br/>
        <input 
          type="range" min="0" max="1" step="0.01" 
          value={threshold} 
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          style={{ width: '200px', marginTop: '10px' }}
        />
      </div>

      <Canvas camera={{ position: [0, 0, 20] }}>
        <BrainScene threshold={threshold} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}