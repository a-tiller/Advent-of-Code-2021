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

class IndexedPriorityQueue {
  constructor(iterable = [], compare = (a, b) => (a - b)) {
    this.keyIndexToLabel = [];
    this.labelToKeyIndex = new Map();

    this.values = []; // maps from key index to value
    this.positionMap = []; // maps from key index to position in the heap
    this.inverseMap = []; // maps from position in heap to key index

    this.size = 0;
    this.compare = compare;

    iterable.forEach((value, index) => {
      this.addPair(index, value);
    })
  }

  addPair(label, value) {
    this.keyIndexToLabel.push(label);
    let ki = this.keyIndexToLabel.length - 1;
    this.labelToKeyIndex.set(label, ki);
    this.insert(ki, value);
  }

  remove(ki) {
    const index = this.positionMap[ki];
    this.size--;
    this.swap(index, this.size);

    this.sink(index);
    this.swim(index);

    const value = this.valueOf(ki);
    this.values[ki] = null;
    this.positionMap[ki] = -1;
    this.inverseMap[this.size] = -1;

    return value;
  }

  valueOf(ki) {
    return this.values[ki];
  }

  peekMinKeyIndex() {
    return this.inverseMap[0];
  }

  pollMinKeyIndex() {
    let ki = this.inverseMap[0];
    this.remove(ki);
    return ki;
  }

  peekMinValue() {
    let ki = this.inverseMap[0];
    return this.valueOf(ki);
  }

  pollMinValue() {
    let ki = this.inverseMap[0];
    let value = this.valueOf(ki);
    this.remove(ki);
    return value;
  }

  pollMinPair() {
    const label = this.keyIndexToLabel[this.peekMinKeyIndex()];
    const value = this.pollMinValue();
    return [label, value];
  }

  insert(ki, value) {
    this.values[ki] = value;

    this.positionMap[ki] = this.size;
    this.inverseMap[this.size] = ki;
    this.swim(this.size);
    this.size++;
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

      if (right < this.size && this.less(right, left)) {
        smallest = right;
      }

      if (left >= this.size || this.less(index, smallest)) break;

      this.swap(smallest, index);
      index = smallest;
    }
  }

  swap(i, j) {
    this.positionMap[this.inverseMap[j]] = i;
    this.positionMap[this.inverseMap[i]] = j;
    [this.inverseMap[i], this.inverseMap[j]] = [this.inverseMap[j], this.inverseMap[i]]
  }

  less(i, j) {
    return this.compare(this.values[this.inverseMap[i]], this.values[this.inverseMap[j]]) <= 0;
  }

  update(ki, value) {
    let index = this.positionMap[ki];
    this.values[ki] = value;
    this.sink(i);
    this.swim(i);
  }

  decreaseKey(ki, value) {
    if (this.compare(value, this.values[ki]) < 0) {
      this.values[ki] = value;
      this.swim(this.positionMap[ki]);
    }
  }

  increaseKey(ki, value) {
    if (this.compare(this.values[ki], value) < 0) {
      this.values[ki] = value;
      this.sink(this.positionMap[ki]);
    }
  }
}

module.exports = {IndexedPriorityQueue, PriorityQueue};
