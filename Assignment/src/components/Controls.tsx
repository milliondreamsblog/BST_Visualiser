import { useMemo, useState } from 'react'
import type { PlaybackStatus, TraceStep } from '../animation/traceTypes'

interface ControlsProps {
  status: PlaybackStatus
  speedMs: number
  currentStep: number
  steps: TraceStep[]
  currentMessage: string
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
}

function asInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

export function Controls({
  status,
  speedMs,
  currentStep,
  steps,
  currentMessage,
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
}: ControlsProps) {
  const [inputValue, setInputValue] = useState('')

  const canScrub = steps.length > 0
  const stepNumber = useMemo(
    () => (steps.length === 0 || currentStep < 0 ? 0 : currentStep + 1),
    [currentStep, steps.length]
  )

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
      <div className="controls-grid">
        <div className="controls-row">
          <label htmlFor="value-input" className="control-label">
            Value
          </label>
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
            Clear
          </button>
        </div>

        <div className="controls-row">
          <span className="control-label">Traversals</span>
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

        <div className="controls-row playback-row">
          <span className="control-label">Playback</span>
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
          <label htmlFor="speed-slider" className="control-label speed-label">
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
          <span className="speed-value">{speedMs}ms</span>
        </div>

        <div className="controls-row">
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
      </div>

      <div className="trace-message" role="status">
        {currentMessage || 'Run an operation to generate a step trace.'}
      </div>
    </section>
  )
}
