import type { EdgeFocus, TraceStepKind } from '../animation/traceTypes'
import type { LayoutEdge, LayoutNode, NodePosition } from '../layout/calculateLayout'
import { Node } from './Node'

interface CanvasProps {
  width: number
  height: number
  nodes: LayoutNode[]
  edges: LayoutEdge[]
  positions: Map<string, NodePosition>
  activeNodeIds: string[]
  activeEdge: EdgeFocus | null
  currentKind: TraceStepKind | null
}

function isEdgeActive(edge: LayoutEdge, activeEdge: EdgeFocus | null): boolean {
  if (!activeEdge) {
    return false
  }
  return edge.parentId === activeEdge.fromId && edge.childId === activeEdge.toId
}

export function Canvas({
  width,
  height,
  nodes,
  edges,
  positions,
  activeNodeIds,
  activeEdge,
  currentKind,
}: CanvasProps) {
  const activeSet = new Set(activeNodeIds)

  return (
    <section className="bst-canvas-shell">
      <div className="bst-canvas" style={{ width, height }}>
        <svg className="bst-canvas-edges">
          {edges.map((edge) => {
            const source = positions.get(edge.parentId)
            const target = positions.get(edge.childId)
            if (!source || !target) {
              return null
            }

            const edgeClass = isEdgeActive(edge, activeEdge)
              ? 'bst-edge bst-edge-active'
              : 'bst-edge'

            return (
              <line
                key={edge.id}
                className={edgeClass}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
              />
            )
          })}
        </svg>

        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            currentKind={currentKind}
            isActive={activeSet.has(node.id)}
          />
        ))}

        {nodes.length === 0 ? (
          <div className="bst-empty-state">Tree is empty. Insert a value to start.</div>
        ) : null}
      </div>
    </section>
  )
}
