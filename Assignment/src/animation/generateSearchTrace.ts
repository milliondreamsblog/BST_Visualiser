import type { BSTNode } from '../core/BSTNode'
import { makeStep } from './stepFactory'
import type { TraceStep } from './traceTypes'

export function generateSearchTrace(root: BSTNode | null, value: number): TraceStep[] {
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

    if (value === current.value) {
      steps.push(
        makeStep({
          kind: 'found',
          message: `Found ${value}`,
          focusNodeIds: [current.id],
          holdMs: 350,
        })
      )
      return steps
    }

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

    steps.push(
      makeStep({
        kind: 'compare',
        message: `${value} > ${current.value}, move right`,
        focusNodeIds: [current.id],
        activeEdge: current.right ? { fromId: current.id, toId: current.right.id } : null,
      })
    )
    current = current.right
  }

  steps.push(
    makeStep({
      kind: 'not-found',
      message: `${value} is not in the tree`,
      focusNodeIds: [],
      holdMs: 350,
    })
  )
  return steps
}
