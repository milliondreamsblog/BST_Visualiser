import type { TraceStep } from '../animation/traceTypes'

interface TracePanelProps {
  steps: TraceStep[]
  currentStep: number
}

export function TracePanel({ steps, currentStep }: TracePanelProps) {
  return (
    <aside className="trace-panel">
      <h2 className="trace-title">Operation Trace</h2>
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
      </ol>
    </aside>
  )
}
