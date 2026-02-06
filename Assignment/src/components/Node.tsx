import type { TraceStepKind } from '../animation/traceTypes'
import type { LayoutNode } from '../layout/calculateLayout'

interface NodeProps {
  node: LayoutNode
  currentKind: TraceStepKind | null
  isActive: boolean
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

export function Node({ node, currentKind, isActive }: NodeProps) {
  return (
    <div
      className={resolveNodeClass(currentKind, isActive)}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
      }}
    >
      <span className="bst-node-value">{node.value}</span>
    </div>
  )
}
