const input = require("fs")
  .readFileSync("Q2042/input.txt")
  .toString()
  .trim()
  .split("\n");
const [N, M, K] = input[0].split(" ").map(Number);
const arr = Array.from({ length: N + 1 }, (_, index) =>
  index === 0 ? 0n : BigInt(input[index])
);

class SegmentTree {
  constructor(arr, start = 0, end = arr.length - 1, node = 1) {
    const width = 2 ** Math.ceil(Math.log2(arr.length));
    this.tree = new BigInt64Array(2 * width);
    this.arr = arr;
    this.start = start;
    this.end = end;
    this.node = node;
    this.val = null;
  }

  initTree(start = this.start, end = this.end, node = this.node) {
    if (start == end) {
      this.tree[node] = this.arr[start];
      return this.tree[node];
    }
    let mid = parseInt((start + end) / 2);
    this.tree[node] += this.initTree(start, mid, 2 * node);
    this.tree[node] += this.initTree(mid + 1, end, 2 * node + 1);
    return this.tree[node];
  }

  getSum(left, right, start = this.start, end = this.end, node = this.node) {
    if (start > right || end < left) return 0n;
    if (start >= left && end <= right) return this.tree[node];
    let mid = parseInt((start + end) / 2);
    return (
      this.getSum(left, right, start, mid, 2 * node) +
      this.getSum(left, right, mid + 1, end, 2 * node + 1)
    );
  }

  update(index, val, start = this.start, end = this.end, node = this.node) {
    if (index < start || index > end) return;
    let diff = val - this.arr[index];
    this.tree[node] += diff;
    if (start == end) return;
    let mid = parseInt((start + end) / 2);
    this.update(index, val, start, mid, 2 * node);
    this.update(index, val, mid + 1, end, 2 * node + 1);
    if (node == 1) this.arr[index] = val;
  }
}

const tree = new SegmentTree(arr, 1, N, 1);
tree.initTree();

const answer = [];
for (let i = N + 1; i < N + 1 + M + K; i++) {
  let [a, b, c] = input[i].split(" ").map(Number);
  if (a == 1) tree.update(b, BigInt(c));
  else answer.push(tree.getSum(b, c));
}

console.log(answer.join("\n"));
