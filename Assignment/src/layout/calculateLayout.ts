import type { BSTNode } from '../core/BSTNode'

export interface NodePosition {
  x: number
  y: number
}

export interface LayoutNode {
  id: string
  value: number
  x: number
  y: number
}

export interface LayoutEdge {
  id: string
  parentId: string
  childId: string
  direction: 'left' | 'right'
}

export interface LayoutResult {
  nodes: LayoutNode[]
  edges: LayoutEdge[]
  positions: Map<string, NodePosition>
}

export interface LayoutOptions {
  width: number
  height: number
  padding?: number
}

interface OrderedNode {
  id: string
  value: number
  order: number
  depth: number
}

const DEFAULT_PADDING = 60

function orderNodes(root: BSTNode | null): { ordered: OrderedNode[]; maxDepth: number } {
  const ordered: OrderedNode[] = []
  let order = 0
  let maxDepth = 0

  const walk = (node: BSTNode | null, depth: number): void => {
    if (!node) {
      return
    }
    walk(node.left, depth + 1)
    ordered.push({ id: node.id, value: node.value, order, depth })
    order += 1
    maxDepth = Math.max(maxDepth, depth)
    walk(node.right, depth + 1)
  }

  walk(root, 0)

  return { ordered, maxDepth }
}

function collectEdges(root: BSTNode | null): LayoutEdge[] {
  const edges: LayoutEdge[] = []

  const walk = (node: BSTNode | null): void => {
    if (!node) {
      return
    }

    if (node.left) {
      edges.push({
        id: `${node.id}-${node.left.id}`,
        parentId: node.id,
        childId: node.left.id,
        direction: 'left',
      })
      walk(node.left)
    }

    if (node.right) {
      edges.push({
        id: `${node.id}-${node.right.id}`,
        parentId: node.id,
        childId: node.right.id,
        direction: 'right',
      })
      walk(node.right)
    }
  }

  walk(root)
  return edges
}

export function calculateLayout(root: BSTNode | null, options: LayoutOptions): LayoutResult {
  const positions = new Map<string, NodePosition>()

  if (!root) {
    return { nodes: [], edges: [], positions }
  }

  const width = Math.max(options.width, 320)
  const height = Math.max(options.height, 240)
  const padding = options.padding ?? DEFAULT_PADDING

  const { ordered, maxDepth } = orderNodes(root)
  const totalNodes = ordered.length
  const usableWidth = Math.max(1, width - padding * 2)
  const usableHeight = Math.max(1, height - padding * 2)
  const verticalGap = maxDepth === 0 ? 0 : usableHeight / maxDepth

  const nodes: LayoutNode[] = ordered.map((node) => {
    const x =
      totalNodes === 1 ? width / 2 : padding + (node.order / (totalNodes - 1)) * usableWidth
    const y = padding + node.depth * verticalGap
    const layoutNode = { id: node.id, value: node.value, x, y }
    positions.set(node.id, { x, y })
    return layoutNode
  })

  return {
    nodes,
    edges: collectEdges(root),
    positions,
  }
}
