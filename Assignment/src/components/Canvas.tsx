import { useEffect, useMemo, useState } from 'react'
import type { EdgeFocus, TraceStepKind } from '../animation/traceTypes'
import type { LayoutEdge, LayoutNode, NodePosition } from '../layout/calculateLayout'
import { Node } from './Node'
import type { NodeMotionState } from './Node'

interface CanvasProps {
  width: number
  height: number
  nodes: LayoutNode[]
  edges: LayoutEdge[]
  positions: Map<string, NodePosition>
  activeNodeIds: string[]
  activeEdge: EdgeFocus | null
  currentKind: TraceStepKind | null
  motionMs?: number
}

interface RenderNode extends LayoutNode {
  motionState: NodeMotionState
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
  motionMs = 460,
}: CanvasProps) {
  const activeSet = new Set(activeNodeIds)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const exitDuration = useMemo(() => Math.max(180, Math.round(motionMs * 0.72)), [motionMs])

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setRenderNodes((previous) => {
        const previousMap = new Map(previous.map((node) => [node.id, node]))
        const nextMap = new Map(nodes.map((node) => [node.id, node]))
        const nextRender: RenderNode[] = []

        for (const node of nodes) {
          const existing = previousMap.get(node.id)
          if (existing) {
            nextRender.push({
              ...node,
              motionState: existing.motionState === 'exit' ? 'stable' : existing.motionState,
            })
          } else {
            nextRender.push({
              ...node,
              motionState: 'enter',
            })
          }
        }

        for (const oldNode of previous) {
          if (!nextMap.has(oldNode.id)) {
            nextRender.push({
              ...oldNode,
              motionState: 'exit',
            })
          }
        }

        return nextRender
      })
    })

    return () => window.cancelAnimationFrame(raf)
  }, [nodes])

  useEffect(() => {
    const hasEntering = renderNodes.some((node) => node.motionState === 'enter')
    if (!hasEntering) {
      return
    }

    const raf = window.requestAnimationFrame(() => {
      setRenderNodes((previous) =>
        previous.map((node) =>
          node.motionState === 'enter' ? { ...node, motionState: 'stable' } : node
        )
      )
    })

    return () => window.cancelAnimationFrame(raf)
  }, [renderNodes])

  useEffect(() => {
    const hasExiting = renderNodes.some((node) => node.motionState === 'exit')
    if (!hasExiting) {
      return
    }

    const timer = window.setTimeout(() => {
      setRenderNodes((previous) => previous.filter((node) => node.motionState !== 'exit'))
    }, exitDuration)

    return () => window.clearTimeout(timer)
  }, [exitDuration, renderNodes])

  return (
    <section className="bst-canvas-shell">
      <div
        className="bst-canvas"
        style={{
          width,
          height,
          ['--node-motion-ms' as string]: `${motionMs}ms`,
          ['--node-exit-ms' as string]: `${exitDuration}ms`,
        }}
      >
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

        {renderNodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            currentKind={currentKind}
            isActive={activeSet.has(node.id)}
            motionState={node.motionState}
          />
        ))}

        {renderNodes.length === 0 ? (
          <div className="bst-empty-state">Tree is empty. Insert a value to start.</div>
        ) : null}
      </div>
    </section>
  )
}
