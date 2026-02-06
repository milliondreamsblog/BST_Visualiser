export type OperationKind =
  | 'insert'
  | 'search'
  | 'delete'
  | 'inorder'
  | 'preorder'
  | 'postorder'

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'complete'

export type TraceStepKind =
  | 'visit'
  | 'compare'
  | 'insert'
  | 'found'
  | 'not-found'
  | 'delete'
  | 'replace'
  | 'traversal'

export interface EdgeFocus {
  fromId: string
  toId: string
}

export interface TraceStep {
  id: string
  kind: TraceStepKind
  message: string
  focusNodeIds: string[]
  activeEdge: EdgeFocus | null
  durationMs?: number
  holdMs?: number
  structural: boolean
}
