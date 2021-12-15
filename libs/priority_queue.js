class PriorityQueue {
  constructor(els = [], compare = (a, b) => (a - b)) {
    this.heapSize = els.length;
    this.heap = [...els];
    this.compare = compare;

    for (let i = Math.max(0, Math.ceil(this.heapSize/2) - 1); i >= 0; i--) {
      this.sink(i);
    }
  }

  isEmpty() {
    return this.heapSize === 0;
  }

  clear() {
    this.heap = [];
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.heap[0];
  }

  poll() {
    return this.removeAt(0)
  }

  contains(el) {
    for (let i = 0; i < this.heapSize; i++) {
      if (this.heap[i] === el) return true;
    }
    return false;
  }

  add(el) {
    this.heap.push(el);
    this.heapSize = this.heap.length;
    this.swim(this.heapSize - 1);
  }

  less(i, j) {
    return this.compare(this.heap[i], this.heap[j]) <= 0;
  }

  swim(index) {
    let parent = Math.floor((index - 1) / 2);

    while (index > 0 && this.less(index, parent)) {
      this.swap(parent, index);
      index = parent;
      parent = Math.floor((index - 1) / 2);
    }
  }

  sink(index) {
    while(true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = left;

      if (right < this.heapSize && this.less(right, left)) {
        smallest = right;
      }

      if (left >= this.heapSize || this.less(index, smallest)) break;

      this.swap(smallest, index);
      index = smallest;
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  remove(el) {
    for (let i = 0; i < this.heapSize; i++) {
      if (this.heap[i] === el) {
        this.removeAt(i);
        return true;
      }
    }
    return false;
  }

  removeAt(i) {
    if (this.isEmpty()) return null;

    this.swap(i, this.heapSize - 1);
    const removed = this.heap.pop();
    this.heapSize = this.heap.length;

    if (i === this.heapSize) {
      return removed;
    }

    const el = this.heap[i];
    this.sink(i);
    if (el === this.heap[i]) {
      this.swim(i);
    }
    return removed;
  }
}

module.exports = {PriorityQueue};
