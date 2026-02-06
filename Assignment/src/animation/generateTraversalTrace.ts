import type { BSTNode } from '../core/BSTNode'
import { makeStep } from './stepFactory'
import type { TraceStep } from './traceTypes'

type TraversalKind = 'inorder' | 'preorder' | 'postorder'

function visitNode(steps: TraceStep[], node: BSTNode): void {
  steps.push(
    makeStep({
      kind: 'traversal',
      message: `Visit ${node.value}`,
      focusNodeIds: [node.id],
    })
  )
}

function walkInorder(node: BSTNode | null, steps: TraceStep[]): void {
  if (!node) {
    return
  }
  walkInorder(node.left, steps)
  visitNode(steps, node)
  walkInorder(node.right, steps)
}

function walkPreorder(node: BSTNode | null, steps: TraceStep[]): void {
  if (!node) {
    return
  }
  visitNode(steps, node)
  walkPreorder(node.left, steps)
  walkPreorder(node.right, steps)
}

function walkPostorder(node: BSTNode | null, steps: TraceStep[]): void {
  if (!node) {
    return
  }
  walkPostorder(node.left, steps)
  walkPostorder(node.right, steps)
  visitNode(steps, node)
}

export function generateTraversalTrace(root: BSTNode | null, kind: TraversalKind): TraceStep[] {
  const steps: TraceStep[] = []

  if (kind === 'inorder') {
    walkInorder(root, steps)
  }

  if (kind === 'preorder') {
    walkPreorder(root, steps)
  }

  if (kind === 'postorder') {
    walkPostorder(root, steps)
  }

  if (steps.length === 0) {
    steps.push(
      makeStep({
        kind: 'not-found',
        message: 'Tree is empty',
      })
    )
  }

  return steps
}
