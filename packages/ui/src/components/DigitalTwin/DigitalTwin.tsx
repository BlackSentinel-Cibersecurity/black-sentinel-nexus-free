'use client';
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sparkles, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GlassPanel } from '../common/GlassPanel';
import { StatusIndicator } from '../common/StatusIndicator';
import { cn } from '../../utils/cn';

interface Node {
  id: string;
  type: string;
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  x: number;
  y: number;
  z: number;
}

interface Edge {
  source: string;
  target: string;
  status: 'active' | 'inactive' | 'compromised';
}

interface DigitalTwinProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
}

function SecurityNode({ node, onClick, isSelected }: { node: Node; onClick: () => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // All statuses use orange with different intensities
  const statusColors = {
    healthy: '#FF6B00',
    warning: '#FF8A30',
    critical: '#E55A00',
    offline: '#525252',
  };

  const riskGlow = {
    critical: 0.8,
    high: 0.5,
    medium: 0.3,
    low: 0.1,
    minimal: 0,
  };

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = node.y + Math.sin(time * 0.5 + node.x) * 0.1;
      
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = statusColors[node.status];
  const glowIntensity = riskGlow[node.riskLevel];

  return (
    <group position={[node.x, node.y, node.z]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={glowIntensity}
            transparent
            opacity={0.9}
            wireframe={node.status === 'offline'}
          />
        </mesh>
        
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.6 : 0.2}
          />
        </mesh>
        
        {/* Label */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          font={undefined}
        >
          {node.label}
        </Text>
        
        {/* Type indicator */}
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.08}
          color="#BDBDBD"
          anchorX="center"
          anchorY="middle"
        >
          {node.type}
        </Text>
      </Float>
    </group>
  );
}

function ConnectionLine({ start, end, status }: { start: THREE.Vector3; end: THREE.Vector3; status: string }) {
  // All connections use orange with different intensities
  const color = status === 'compromised' ? '#E55A00' : status === 'active' ? '#FF6B00' : '#525252';
  
  const points = useMemo(() => [
    start.toArray(),
    new THREE.Vector3().lerpVectors(start, end, 0.5).setY(0.5).toArray(),
    end.toArray(),
  ], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}

function Scene({ nodes, edges, onNodeSelect, selectedNode }: { nodes: Node[]; edges: Edge[]; onNodeSelect: (id: string) => void; selectedNode: string | null }) {
  const nodePositions = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    nodes.forEach((node) => {
      map.set(node.id, new THREE.Vector3(node.x, node.y, node.z));
    });
    return map;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF6B00" />
      
      <Sparkles count={100} scale={20} size={1} speed={0.4} color="#FF6B00" opacity={0.3} />
      
      {nodes.map((node) => (
        <SecurityNode
          key={node.id}
          node={node}
          onClick={() => onNodeSelect(node.id)}
          isSelected={selectedNode === node.id}
        />
      ))}
      
      {edges.map((edge, i) => {
        const start = nodePositions.get(edge.source);
        const end = nodePositions.get(edge.target);
        if (!start || !end) return null;
        return <ConnectionLine key={i} start={start} end={end} status={edge.status} />;
      })}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function DigitalTwin({ nodes, edges, className }: DigitalTwinProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  const statusCounts = useMemo(() => {
    const counts = { healthy: 0, warning: 0, critical: 0, offline: 0 };
    nodes.forEach((n) => counts[n.status]++);
    return counts;
  }, [nodes]);

  return (
    <GlassPanel className={cn('relative overflow-hidden', className)} padding="none">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10 space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Digital Twin - Infraestructura
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StatusIndicator status="active" size="sm" pulse={false} />
            <span className="text-xs text-gray-400">{statusCounts.healthy}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="warning" size="sm" pulse={false} />
            <span className="text-xs text-gray-400">{statusCounts.warning}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="critical" size="sm" pulse={false} />
            <span className="text-xs text-gray-400">{statusCounts.critical}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status="offline" size="sm" pulse={false} />
            <span className="text-xs text-gray-400">{statusCounts.offline}</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="h-[500px]">
        <Canvas
          camera={{ position: [8, 5, 8], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene
            nodes={nodes}
            edges={edges}
            onNodeSelect={setSelectedNode}
            selectedNode={selectedNode}
          />
        </Canvas>
      </div>

      {/* Node detail panel */}
      {selectedNodeData && (
        <div className="absolute top-4 right-4 z-10 w-64">
          <GlassPanel padding="md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{selectedNodeData.label}</h4>
                <StatusIndicator status={selectedNodeData.status === 'healthy' ? 'active' : selectedNodeData.status} size="sm" />
              </div>
              <p className="text-xs text-gray-500">{selectedNodeData.type}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Riesgo</span>
                  <span className={cn(
                    'font-medium capitalize',
                    selectedNodeData.riskLevel === 'critical' && 'text-bsn-orange-600',
                    selectedNodeData.riskLevel === 'high' && 'text-bsn-orange',
                    selectedNodeData.riskLevel === 'medium' && 'text-bsn-orange-400',
                    selectedNodeData.riskLevel === 'low' && 'text-gray-400',
                    selectedNodeData.riskLevel === 'minimal' && 'text-gray-500',
                  )}>
                    {selectedNodeData.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </GlassPanel>
  );
}
