import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    addEdge,
    useNodesState,
    useEdgesState,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const AIWorkflowDiagram = ({ company }) => {
    // Define workflow matching n8n structure
    const workflowData = {
        nodes: [
            {
                id: '1',
                type: 'input',
                data: { label: '💬 User Input' },
                position: { x: 50, y: 120 },
                sourcePosition: Position.Right,
                style: {
                    background: 'rgba(34, 211, 238, 0.15)',
                    border: '2px solid rgba(34, 211, 238, 0.4)',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    minWidth: '160px',
                    textAlign: 'center'
                }
            },
            {
                id: '2',
                data: { label: '🤖\nAI Agent\nTools Agent' },
                position: { x: 300, y: 90 },
                targetPosition: Position.Left,
                style: {
                    background: 'rgba(34, 211, 238, 0.15)',
                    border: '2px solid rgba(34, 211, 238, 0.4)',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '20px 32px',
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '200px',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.4',
                    zIndex: 10
                }
            },
            {
                id: '3',
                data: { label: '🧠\n\nInference\nModel Router' },
                position: { x: 50, y: 320 },
                targetPosition: Position.Top,
                style: {
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '2px solid rgba(34, 211, 238, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: '24px',
                    fontSize: '11px',
                    fontWeight: '500',
                    width: '115px',
                    height: '115px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.3'
                }
            },
            {
                id: '4',
                data: { label: '💾\n\nMemory' },
                position: { x: 200, y: 320 },
                targetPosition: Position.Top,
                style: {
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '2px solid rgba(34, 211, 238, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: '24px',
                    fontSize: '12px',
                    fontWeight: '500',
                    width: '115px',
                    height: '115px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.3'
                }
            },
            {
                id: '5',
                data: { label: '🔍\n\nSearch' },
                position: { x: 350, y: 320 },
                targetPosition: Position.Top,
                style: {
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '2px solid rgba(34, 211, 238, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: '24px',
                    fontSize: '12px',
                    fontWeight: '500',
                    width: '115px',
                    height: '115px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.3'
                }
            },
            {
                id: '6',
                data: { label: '📝\n\nTodo Tool' },
                position: { x: 500, y: 320 },
                targetPosition: Position.Top,
                style: {
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '2px solid rgba(34, 211, 238, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    padding: '24px',
                    fontSize: '12px',
                    fontWeight: '500',
                    width: '115px',
                    height: '115px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.3'
                }
            },
            {
                id: '7',
                type: 'output',
                data: { label: '✅ Output' },
                position: { x: 620, y: 120 },
                targetPosition: Position.Left,
                style: {
                    background: 'rgba(34, 211, 238, 0.15)',
                    border: '2px solid rgba(34, 211, 238, 0.4)',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    minWidth: '120px',
                    textAlign: 'center'
                }
            }
        ],
        edges: [
            {
                id: 'e1-2',
                source: '1',
                target: '2',
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                animated: true,
                style: { stroke: 'rgba(34, 211, 238, 0.6)', strokeWidth: 2 }
            },
            {
                id: 'e2-3',
                source: '2',
                target: '3',
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                animated: false,
                style: { stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' }
            },
            {
                id: 'e2-4',
                source: '2',
                target: '4',
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                animated: false,
                style: { stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' }
            },
            {
                id: 'e2-5',
                source: '2',
                target: '5',
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                animated: false,
                style: { stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' }
            },
            {
                id: 'e2-6',
                source: '2',
                target: '6',
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                animated: false,
                style: { stroke: 'rgba(34, 211, 238, 0.4)', strokeWidth: 2, strokeDasharray: '5,5' }
            },
            {
                id: 'e2-7',
                source: '2',
                target: '7',
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                animated: true,
                style: { stroke: 'rgba(34, 211, 238, 0.6)', strokeWidth: 2 }
            }
        ]
    };

    const [nodes, setNodes, onNodesChange] = useNodesState(workflowData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(workflowData.edges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
            >
                <Background color="rgba(34, 211, 238, 0.1)" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
};

export default AIWorkflowDiagram;
