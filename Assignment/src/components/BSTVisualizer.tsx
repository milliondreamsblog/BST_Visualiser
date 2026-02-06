import { Canvas } from './Canvas'
import { Controls } from './Controls'
import { TracePanel } from './TracePanel'
import { useBSTVisualizer } from '../hooks/useBSTVisualizer'

const CANVAS_WIDTH = 920
const CANVAS_HEIGHT = 520

export function BSTVisualizer() {
  const visualizer = useBSTVisualizer({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    initialSpeedMs: 640,
  })

  return (
    <main className="visualizer-page">
      <section className="hero-shell">
        <h1 className="hero-title">Binary Search Tree Visualizer</h1>
        <p className="hero-subtitle">
          Step through insert, delete, search, and traversals with a dedicated animation trace layer.
        </p>
      </section>

      <section className="visualizer-layout">
        <div className="main-column">
          <Canvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            nodes={visualizer.layout.nodes}
            edges={visualizer.layout.edges}
            positions={visualizer.layout.positions}
            activeNodeIds={visualizer.activeNodeIds}
            activeEdge={visualizer.activeEdge}
            currentKind={visualizer.currentKind}
          />

          <Controls
            status={visualizer.status}
            speedMs={visualizer.speedMs}
            currentStep={visualizer.currentStep}
            steps={visualizer.steps}
            currentMessage={visualizer.currentMessage}
            onSpeedChange={visualizer.setSpeedMs}
            onInsert={visualizer.insert}
            onSearch={visualizer.search}
            onDelete={visualizer.remove}
            onInorder={visualizer.inorder}
            onPreorder={visualizer.preorder}
            onPostorder={visualizer.postorder}
            onClear={visualizer.clear}
            onPlayPause={visualizer.playPause}
            onStepForward={visualizer.stepForward}
            onStepBackward={visualizer.stepBackward}
            onResetPlayback={visualizer.resetPlayback}
            onScrubStep={visualizer.jumpToStep}
          />
        </div>

        <TracePanel steps={visualizer.steps} currentStep={visualizer.currentStep} />
      </section>
    </main>
  )
}
