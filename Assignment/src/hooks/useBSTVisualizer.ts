import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  generateDeleteTrace,
  generateInsertTrace,
  generateSearchTrace,
  generateTraversalTrace,
  resetStepCounter,
} from '../animation'
import type { EdgeFocus, PlaybackStatus, TraceStep, TraceStepKind } from '../animation/traceTypes'
import { BST } from '../core/bst'
import { cloneTree, resetNodeIdCounter } from '../core/BSTNode'
import type { BSTNode } from '../core/BSTNode'
import { calculateLayout } from '../layout/calculateLayout'

interface HookOptions {
  width: number
  height: number
  initialSpeedMs?: number
}

interface RunContext {
  before: BSTNode | null
  after: BSTNode | null
  steps: TraceStep[]
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function useBSTVisualizer(options: HookOptions) {
  const bstRef = useRef(new BST())

  const [beforeRoot, setBeforeRoot] = useState<BSTNode | null>(null)
  const [afterRoot, setAfterRoot] = useState<BSTNode | null>(null)
  const [steps, setSteps] = useState<TraceStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [status, setStatus] = useState<PlaybackStatus>('idle')
  const [speedMs, setSpeedMs] = useState(options.initialSpeedMs ?? 700)

  const firstStructuralStep = useMemo(
    () => steps.findIndex((step) => step.structural),
    [steps]
  )

  const visibleRoot = useMemo(() => {
    const shouldUseBefore =
      firstStructuralStep !== -1 && currentStep >= 0 && currentStep < firstStructuralStep

    if (shouldUseBefore) {
      return beforeRoot
    }

    return afterRoot
  }, [afterRoot, beforeRoot, currentStep, firstStructuralStep])

  const layout = useMemo(
    () =>
      calculateLayout(visibleRoot, {
        width: options.width,
        height: options.height,
      }),
    [options.height, options.width, visibleRoot]
  )

  const activeStep = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null

  const runWithTrace = useCallback((context: RunContext) => {
    setBeforeRoot(context.before)
    setAfterRoot(context.after)
    setSteps(context.steps)

    if (context.steps.length === 0) {
      setCurrentStep(-1)
      setStatus('idle')
      return
    }

    setCurrentStep(0)
    setStatus('playing')
  }, [])

  const insert = useCallback(
    (value: number) => {
      const before = cloneTree(bstRef.current.root)
      const result = bstRef.current.insert(value)
      const after = cloneTree(bstRef.current.root)
      const trace = generateInsertTrace(before, value, result.nodeId)
      runWithTrace({ before, after, steps: trace })
    },
    [runWithTrace]
  )

  const search = useCallback(
    (value: number) => {
      const before = cloneTree(bstRef.current.root)
      bstRef.current.search(value)
      const after = cloneTree(bstRef.current.root)
      const trace = generateSearchTrace(before, value)
      runWithTrace({ before, after, steps: trace })
    },
    [runWithTrace]
  )

  const remove = useCallback(
    (value: number) => {
      const before = cloneTree(bstRef.current.root)
      bstRef.current.delete(value)
      const after = cloneTree(bstRef.current.root)
      const trace = generateDeleteTrace(before, value)
      runWithTrace({ before, after, steps: trace })
    },
    [runWithTrace]
  )

  const inorder = useCallback(() => {
    const before = cloneTree(bstRef.current.root)
    const after = cloneTree(bstRef.current.root)
    const trace = generateTraversalTrace(before, 'inorder')
    runWithTrace({ before, after, steps: trace })
  }, [runWithTrace])

  const preorder = useCallback(() => {
    const before = cloneTree(bstRef.current.root)
    const after = cloneTree(bstRef.current.root)
    const trace = generateTraversalTrace(before, 'preorder')
    runWithTrace({ before, after, steps: trace })
  }, [runWithTrace])

  const postorder = useCallback(() => {
    const before = cloneTree(bstRef.current.root)
    const after = cloneTree(bstRef.current.root)
    const trace = generateTraversalTrace(before, 'postorder')
    runWithTrace({ before, after, steps: trace })
  }, [runWithTrace])

  const clear = useCallback(() => {
    bstRef.current.clear()
    resetNodeIdCounter()
    resetStepCounter()
    setBeforeRoot(null)
    setAfterRoot(null)
    setSteps([])
    setCurrentStep(-1)
    setStatus('idle')
  }, [])

  const playPause = useCallback(() => {
    if (steps.length === 0) {
      return
    }

    if (status === 'playing') {
      setStatus('paused')
      return
    }

    if (status === 'complete') {
      setCurrentStep(0)
    }

    setStatus('playing')
  }, [status, steps.length])

  const stepForward = useCallback(() => {
    if (steps.length === 0) {
      return
    }

    setStatus('paused')
    setCurrentStep((prev) => {
      const next = clamp(prev + 1, 0, steps.length - 1)
      if (next === steps.length - 1) {
        setStatus('complete')
      }
      return next
    })
  }, [steps.length])

  const stepBackward = useCallback(() => {
    if (steps.length === 0) {
      return
    }

    setStatus('paused')
    setCurrentStep((prev) => clamp(prev - 1, 0, steps.length - 1))
  }, [steps.length])

  const resetPlayback = useCallback(() => {
    if (steps.length === 0) {
      return
    }
    setCurrentStep(0)
    setStatus('paused')
  }, [steps.length])

  const jumpToStep = useCallback(
    (index: number) => {
      if (steps.length === 0) {
        return
      }

      const target = clamp(index, 0, steps.length - 1)
      setCurrentStep(target)
      setStatus(target === steps.length - 1 ? 'complete' : 'paused')
    },
    [steps.length]
  )

  useEffect(() => {
    if (status !== 'playing') {
      return
    }

    if (steps.length === 0 || currentStep < 0) {
      return
    }

    if (currentStep >= steps.length - 1) {
      return
    }

    const step = steps[currentStep]
    const delay = step.holdMs ?? speedMs

    const timer = window.setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next >= steps.length - 1) {
          setStatus('complete')
          return steps.length - 1
        }
        return next
      })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [currentStep, speedMs, status, steps])

  const activeNodeIds = activeStep?.focusNodeIds ?? []
  const activeEdge: EdgeFocus | null = activeStep?.activeEdge ?? null
  const currentMessage = activeStep?.message ?? ''
  const currentKind: TraceStepKind | null = activeStep?.kind ?? null
  const progress = steps.length === 0 || currentStep < 0 ? 0 : (currentStep + 1) / steps.length

  return {
    layout,
    steps,
    currentStep,
    currentMessage,
    currentKind,
    activeNodeIds,
    activeEdge,
    progress,
    status,
    speedMs,
    setSpeedMs,
    insert,
    search,
    remove,
    inorder,
    preorder,
    postorder,
    clear,
    playPause,
    stepForward,
    stepBackward,
    resetPlayback,
    jumpToStep,
  }
}
