import type { BSTNode } from '../core/BSTNode'
import { makeStep } from './stepFactory'
import type { TraceStep } from './traceTypes'

function findMin(node: BSTNode): BSTNode {
  let current = node
  while (current.left) {
    current = current.left
  }
  return current
}

export function generateDeleteTrace(root: BSTNode | null, value: number): TraceStep[] {
  const steps: TraceStep[] = []
  let current = root

  while (current) {
    steps.push(
      makeStep({
        kind: 'visit',
        message: `Visit ${current.value}`,
        focusNodeIds: [current.id],
      })
    )

    if (value < current.value) {
      steps.push(
        makeStep({
          kind: 'compare',
          message: `${value} < ${current.value}, move left`,
          focusNodeIds: [current.id],
          activeEdge: current.left ? { fromId: current.id, toId: current.left.id } : null,
        })
      )
      current = current.left
      continue
    }

    if (value > current.value) {
      steps.push(
        makeStep({
          kind: 'compare',
          message: `${value} > ${current.value}, move right`,
          focusNodeIds: [current.id],
          activeEdge: current.right ? { fromId: current.id, toId: current.right.id } : null,
        })
      )
      current = current.right
      continue
    }

    steps.push(
      makeStep({
        kind: 'delete',
        message: `Delete node ${current.value}`,
        focusNodeIds: [current.id],
        structural: true,
      })
    )

    if (current.left && current.right) {
      const successor = findMin(current.right)

      steps.push(
        makeStep({
          kind: 'replace',
          message: `Replace ${current.value} with successor ${successor.value}`,
          focusNodeIds: [current.id, successor.id],
          activeEdge: { fromId: current.id, toId: current.right.id },
          structural: true,
          holdMs: 350,
        })
      )
    }

    return steps
  }

  steps.push(
    makeStep({
      kind: 'not-found',
      message: `${value} is not in the tree`,
    })
  )

  return steps
}
