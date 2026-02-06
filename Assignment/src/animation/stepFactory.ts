import type { EdgeFocus, TraceStep, TraceStepKind } from './traceTypes'

let stepCounter = 0

function nextStepId(): string {
  stepCounter += 1
  return `step-${stepCounter}`
}

export function resetStepCounter(): void {
  stepCounter = 0
}

export function makeStep(input: {
  kind: TraceStepKind
  message: string
  focusNodeIds?: string[]
  activeEdge?: EdgeFocus | null
  durationMs?: number
  holdMs?: number
  structural?: boolean
}): TraceStep {
  return {
    id: nextStepId(),
    kind: input.kind,
    message: input.message,
    focusNodeIds: input.focusNodeIds ?? [],
    activeEdge: input.activeEdge ?? null,
    durationMs: input.durationMs,
    holdMs: input.holdMs,
    structural: input.structural ?? false,
  }
}
