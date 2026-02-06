import { useEffect, useRef, useState } from 'react'
import { Canvas } from './Canvas'
import { Controls } from './Controls'
import { TracePanel } from './TracePanel'
import { useBSTVisualizer } from '../hooks/useBSTVisualizer'

const INITIAL_WIDTH = 920
const INITIAL_HEIGHT = 620

export function BSTVisualizer() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [traceOpen, setTraceOpen] = useState(false)
  const [canvasSize, setCanvasSize] = useState({
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      const nextWidth = Math.max(360, Math.floor(entry.contentRect.width - 16))
      const nextHeight = Math.max(320, Math.floor(entry.contentRect.height - 16))

      setCanvasSize((previous) => {
        if (previous.width === nextWidth && previous.height === nextHeight) {
          return previous
        }

        return {
          width: nextWidth,
          height: nextHeight,
        }
      })
    })

    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const visualizer = useBSTVisualizer({
    width: canvasSize.width,
    height: canvasSize.height,
    initialSpeedMs: 640,
  })

  return (
    <main className="visualizer-page">
      <section className="visualizer-layout">
        <div className="canvas-pane" ref={stageRef}>
          <Canvas
            width={canvasSize.width}
            height={canvasSize.height}
            nodes={visualizer.layout.nodes}
            edges={visualizer.layout.edges}
            positions={visualizer.layout.positions}
            activeNodeIds={visualizer.activeNodeIds}
            activeEdge={visualizer.activeEdge}
            currentKind={visualizer.currentKind}
            motionMs={Math.max(280, Math.round(visualizer.speedMs * 0.62))}
          />

          <TracePanel
            steps={visualizer.steps}
            currentStep={visualizer.currentStep}
            isOpen={traceOpen}
            onClose={() => setTraceOpen(false)}
          />
        </div>

        <aside className="controls-pane">
          <Controls
            status={visualizer.status}
            speedMs={visualizer.speedMs}
            currentStep={visualizer.currentStep}
            steps={visualizer.steps}
            currentMessage={visualizer.currentMessage}
            currentKind={visualizer.currentKind}
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
            isTraceOpen={traceOpen}
            onToggleTrace={() => setTraceOpen((previous) => !previous)}
          />
        </aside>
      </section>
    </main>
  )
}
