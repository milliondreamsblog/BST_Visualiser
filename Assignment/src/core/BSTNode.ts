export interface BSTNode {
  id: string
  value: number
  left: BSTNode | null
  right: BSTNode | null
}

let nodeIdCounter = 0

export function createNode(value: number): BSTNode {
  nodeIdCounter += 1
  return {
    id: `node-${nodeIdCounter}`,
    value,
    left: null,
    right: null,
  }
}

export function resetNodeIdCounter(): void {
  nodeIdCounter = 0
}

export function cloneTree(node: BSTNode | null): BSTNode | null {
  if (!node) {
    return null
  }

  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  }
}
