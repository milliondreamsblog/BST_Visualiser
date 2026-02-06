import type { TraceStepKind } from '../animation/traceTypes'
import type { LayoutNode } from '../layout/calculateLayout'

export type NodeMotionState = 'stable' | 'enter' | 'exit'

interface NodeProps {
  node: LayoutNode
  currentKind: TraceStepKind | null
  isActive: boolean
  motionState?: NodeMotionState
}

function resolveNodeClass(currentKind: TraceStepKind | null, isActive: boolean): string {
  if (!isActive) {
    return 'bst-node'
  }

  if (currentKind === 'found') {
    return 'bst-node bst-node-found'
  }

  if (currentKind === 'delete') {
    return 'bst-node bst-node-delete'
  }

  if (currentKind === 'insert') {
    return 'bst-node bst-node-insert'
  }

  return 'bst-node bst-node-active'
}

function resolveMotionClass(motionState: NodeMotionState): string {
  if (motionState === 'enter') {
    return 'bst-node-motion-enter'
  }

  if (motionState === 'exit') {
    return 'bst-node-motion-exit'
  }

  return ''
}

export function Node({ node, currentKind, isActive, motionState = 'stable' }: NodeProps) {
  const stateClass = resolveNodeClass(currentKind, isActive)
  const motionClass = resolveMotionClass(motionState)

  return (
    <div
      className={`${stateClass} ${motionClass}`.trim()}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
      }}
    >
      <span className="bst-node-value">{node.value}</span>
    </div>
  )
}
