import type { TraceStep } from '../animation/traceTypes'

interface TracePanelProps {
  steps: TraceStep[]
  currentStep: number
  isOpen: boolean
  onClose: () => void
}

export function TracePanel({ steps, currentStep, isOpen, onClose }: TracePanelProps) {
  return (
    <div className={isOpen ? 'trace-overlay trace-overlay-open' : 'trace-overlay'}>
      <button className="trace-scrim" aria-label="Close trace panel" onClick={onClose} />

      <aside className="trace-panel">
        <div className="trace-header">
          <h2 className="trace-title">Operation Trace</h2>
          <button className="btn btn-ghost trace-close" onClick={onClose}>
            Close
          </button>
        </div>

        <ol className="trace-list">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            return (
              <li
                key={step.id}
                className={isActive ? 'trace-item trace-item-active' : 'trace-item'}
              >
                <span className="trace-step-index">{index + 1}</span>
                <span>{step.message}</span>
              </li>
            )
          })}
          {steps.length === 0 ? <li className="trace-empty">No trace yet. Run an operation.</li> : null}
        </ol>
      </aside>
    </div>
  )
}
