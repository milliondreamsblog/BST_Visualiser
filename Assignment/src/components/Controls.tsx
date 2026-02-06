import { useMemo, useState } from 'react'
import type { PlaybackStatus, TraceStep, TraceStepKind } from '../animation/traceTypes'

interface ControlsProps {
  status: PlaybackStatus
  speedMs: number
  currentStep: number
  steps: TraceStep[]
  currentMessage: string
  currentKind: TraceStepKind | null
  onSpeedChange: (value: number) => void
  onInsert: (value: number) => void
  onSearch: (value: number) => void
  onDelete: (value: number) => void
  onInorder: () => void
  onPreorder: () => void
  onPostorder: () => void
  onClear: () => void
  onPlayPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onResetPlayback: () => void
  onScrubStep: (index: number) => void
  isTraceOpen: boolean
  onToggleTrace: () => void
}

function asInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function getLessonCopy(kind: TraceStepKind | null): { title: string; description: string } {
  if (kind === 'visit' || kind === 'compare') {
    return {
      title: 'Path Decision',
      description: 'Compare target with current node and choose left or right subtree.',
    }
  }

  if (kind === 'insert') {
    return {
      title: 'Insertion Rule',
      description: 'A new value is attached at the first null position on the valid branch.',
    }
  }

  if (kind === 'delete' || kind === 'replace') {
    return {
      title: 'Deletion Strategy',
      description: 'Delete handles 3 cases: leaf, one child, or successor replacement.',
    }
  }

  if (kind === 'found') {
    return {
      title: 'Search Success',
      description: 'Exact match reached. BST search stops immediately.',
    }
  }

  if (kind === 'traversal') {
    return {
      title: 'Traversal Walk',
      description: 'Traversal order controls visit timing, not tree structure.',
    }
  }

  return {
    title: 'BST Learning Mode',
    description: 'Run operations to observe decision paths and structural changes step by step.',
  }
}

export function Controls({
  status,
  speedMs,
  currentStep,
  steps,
  currentMessage,
  currentKind,
  onSpeedChange,
  onInsert,
  onSearch,
  onDelete,
  onInorder,
  onPreorder,
  onPostorder,
  onClear,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onResetPlayback,
  onScrubStep,
  isTraceOpen,
  onToggleTrace,
}: ControlsProps) {
  const [inputValue, setInputValue] = useState('')

  const canScrub = steps.length > 0
  const stepNumber = useMemo(
    () => (steps.length === 0 || currentStep < 0 ? 0 : currentStep + 1),
    [currentStep, steps.length]
  )
  const completion = steps.length > 0 ? Math.round((stepNumber / steps.length) * 100) : 0
  const lesson = getLessonCopy(currentKind)

  const runValueAction = (action: (value: number) => void): void => {
    const value = asInt(inputValue)
    if (value === null) {
      return
    }
    action(value)
    setInputValue('')
  }

  return (
    <section className="controls-shell">
      <div className="learning-card">
        <span className="learning-kicker">Learning Platform</span>
        <h2 className="learning-title">{lesson.title}</h2>
        <p className="learning-description">{lesson.description}</p>
        <div className="learning-stats">
          <span className="status-pill">Status: {status}</span>
          <span className="status-pill">Progress: {completion}%</span>
        </div>
      </div>

      <div className="controls-header">
        <h1 className="controls-title">BST Controls</h1>
        <button className="btn btn-ghost" onClick={onToggleTrace}>
          {isTraceOpen ? 'Hide Trace' : 'Show Trace'}
        </button>
      </div>

      <div className="controls-grid">
        <div className="control-block">
          <span className="control-label">Value Input</span>
          <input
            id="value-input"
            className="value-input"
            type="number"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                runValueAction(onInsert)
              }
            }}
            placeholder="e.g. 42"
          />
          <div className="control-actions">
            <button className="btn btn-primary" onClick={() => runValueAction(onInsert)}>
              Insert
            </button>
            <button className="btn btn-secondary" onClick={() => runValueAction(onSearch)}>
              Search
            </button>
            <button className="btn btn-danger" onClick={() => runValueAction(onDelete)}>
              Delete
            </button>
            <button className="btn btn-ghost" onClick={onClear}>
              Clear Tree
            </button>
          </div>
        </div>

        <div className="control-block">
          <span className="control-label">Traversals</span>
          <div className="control-actions">
            <button className="btn btn-secondary" onClick={onInorder}>
              Inorder
            </button>
            <button className="btn btn-secondary" onClick={onPreorder}>
              Preorder
            </button>
            <button className="btn btn-secondary" onClick={onPostorder}>
              Postorder
            </button>
          </div>
        </div>

        <div className="control-block playback-row">
          <span className="control-label">Playback</span>
          <div className="control-actions">
            <button className="btn btn-ghost" onClick={onResetPlayback}>
              Reset
            </button>
            <button className="btn btn-ghost" onClick={onStepBackward}>
              Back
            </button>
            <button className="btn btn-primary" onClick={onPlayPause}>
              {status === 'playing' ? 'Pause' : 'Play'}
            </button>
            <button className="btn btn-ghost" onClick={onStepForward}>
              Next
            </button>
          </div>

          <label htmlFor="speed-slider" className="control-label">
            Speed
          </label>
          <input
            id="speed-slider"
            className="speed-slider"
            type="range"
            min={180}
            max={1600}
            step={20}
            value={speedMs}
            onChange={(event) => onSpeedChange(Number.parseInt(event.target.value, 10))}
          />
          <span className="speed-value">{speedMs} ms</span>
        </div>

        <div className="control-block">
          <label htmlFor="timeline-slider" className="control-label">
            Timeline
          </label>
          <input
            id="timeline-slider"
            className="timeline-slider"
            type="range"
            min={0}
            max={Math.max(0, steps.length - 1)}
            value={Math.max(0, currentStep)}
            onChange={(event) => onScrubStep(Number.parseInt(event.target.value, 10))}
            disabled={!canScrub}
          />
          <span className="timeline-value">
            {stepNumber} / {steps.length}
          </span>
        </div>

        <div className="control-block">
          <span className="control-label">Legend</span>
          <div className="legend-list">
            <div className="legend-item">
              <span className="legend-dot legend-active" />
              <span>Current comparison or visit</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-found" />
              <span>Search success</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-insert" />
              <span>Inserted node</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot legend-delete" />
              <span>Delete or replace action</span>
            </div>
          </div>
        </div>
      </div>

      <div className="trace-message" role="status">
        {currentMessage || 'Run an operation to generate a step trace.'}
      </div>
    </section>
  )
}
