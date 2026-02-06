import type { BSTNode } from '../core/BSTNode'
import { makeStep } from './stepFactory'
import type { TraceStep } from './traceTypes'

export function generateInsertTrace(
  root: BSTNode | null,
  value: number,
  insertedNodeId: string | null
): TraceStep[] {
  const steps: TraceStep[] = []

  if (!root) {
    if (!insertedNodeId) {
      return [
        makeStep({
          kind: 'not-found',
          message: `Could not insert ${value}`,
        }),
      ]
    }

    return [
      makeStep({
        kind: 'insert',
        message: `Insert ${value} as root`,
        focusNodeIds: [insertedNodeId],
        structural: true,
        holdMs: 350,
      }),
    ]
  }

  let current: BSTNode | null = root

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

      if (!current.left) {
        if (!insertedNodeId) {
          steps.push(
            makeStep({
              kind: 'not-found',
              message: `${value} already exists`,
            })
          )
          return steps
        }

        steps.push(
          makeStep({
            kind: 'insert',
            message: `Insert ${value} as left child of ${current.value}`,
            focusNodeIds: [current.id, insertedNodeId],
            structural: true,
            holdMs: 350,
          })
        )
        return steps
      }

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

      if (!current.right) {
        if (!insertedNodeId) {
          steps.push(
            makeStep({
              kind: 'not-found',
              message: `${value} already exists`,
            })
          )
          return steps
        }

        steps.push(
          makeStep({
            kind: 'insert',
            message: `Insert ${value} as right child of ${current.value}`,
            focusNodeIds: [current.id, insertedNodeId],
            structural: true,
            holdMs: 350,
          })
        )
        return steps
      }

      current = current.right
      continue
    }

    steps.push(
      makeStep({
        kind: 'not-found',
        message: `${value} already exists`,
        focusNodeIds: [current.id],
      })
    )
    return steps
  }

  return steps
}
