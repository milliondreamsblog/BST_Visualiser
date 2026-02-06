import { createNode } from './BSTNode'
import type { BSTNode } from './BSTNode'

export class BST {
  root: BSTNode | null = null

  insert(value: number): { inserted: boolean; nodeId: string | null } {
    const newNode = createNode(value)

    if (!this.root) {
      this.root = newNode
      return { inserted: true, nodeId: newNode.id }
    }

    let current: BSTNode | null = this.root

    while (current) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode
          return { inserted: true, nodeId: newNode.id }
        }
        current = current.left
        continue
      }

      if (value > current.value) {
        if (!current.right) {
          current.right = newNode
          return { inserted: true, nodeId: newNode.id }
        }
        current = current.right
        continue
      }

      return { inserted: false, nodeId: null }
    }

    return { inserted: false, nodeId: null }
  }

  search(value: number): BSTNode | null {
    let current = this.root

    while (current) {
      if (value === current.value) {
        return current
      }

      current = value < current.value ? current.left : current.right
    }

    return null
  }

  delete(value: number): boolean {
    const [nextRoot, deleted] = this.deleteNode(this.root, value)
    this.root = nextRoot
    return deleted
  }

  clear(): void {
    this.root = null
  }

  inorder(): number[] {
    const output: number[] = []
    this.traverseInorder(this.root, output)
    return output
  }

  preorder(): number[] {
    const output: number[] = []
    this.traversePreorder(this.root, output)
    return output
  }

  postorder(): number[] {
    const output: number[] = []
    this.traversePostorder(this.root, output)
    return output
  }

  private deleteNode(node: BSTNode | null, value: number): [BSTNode | null, boolean] {
    if (!node) {
      return [null, false]
    }

    if (value < node.value) {
      const [nextLeft, deleted] = this.deleteNode(node.left, value)
      node.left = nextLeft
      return [node, deleted]
    }

    if (value > node.value) {
      const [nextRight, deleted] = this.deleteNode(node.right, value)
      node.right = nextRight
      return [node, deleted]
    }

    if (!node.left && !node.right) {
      return [null, true]
    }

    if (!node.left) {
      return [node.right, true]
    }

    if (!node.right) {
      return [node.left, true]
    }

    const successor = this.findMin(node.right)
    node.value = successor.value
    const [nextRight] = this.deleteNode(node.right, successor.value)
    node.right = nextRight
    return [node, true]
  }

  private findMin(node: BSTNode): BSTNode {
    let current = node
    while (current.left) {
      current = current.left
    }
    return current
  }

  private traverseInorder(node: BSTNode | null, output: number[]): void {
    if (!node) {
      return
    }
    this.traverseInorder(node.left, output)
    output.push(node.value)
    this.traverseInorder(node.right, output)
  }

  private traversePreorder(node: BSTNode | null, output: number[]): void {
    if (!node) {
      return
    }
    output.push(node.value)
    this.traversePreorder(node.left, output)
    this.traversePreorder(node.right, output)
  }

  private traversePostorder(node: BSTNode | null, output: number[]): void {
    if (!node) {
      return
    }
    this.traversePostorder(node.left, output)
    this.traversePostorder(node.right, output)
    output.push(node.value)
  }
}

export type { BSTNode }
