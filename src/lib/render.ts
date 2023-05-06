import createElement from './createElement'

function createDom(fiber) {
  const dom = fiber.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

  const isProperty = key => key !== 'children'
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name]
    })

  return dom
}

function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  console.log('render')
  // 每一个工作单元是 一个 fiber, 也就是一个 ReactElement
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }

  nextUnitOfWork = wipRoot
}

let wipRoot = null
let nextUnitOfWork = null // fiber
// Step VI
function workLoop(deadline) {
  let shouldYield = false // 是否有剩余时间
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  // 当 nextUnitOfWork 为 undefined 时, 代表构建完了所有 fiber, 再进行渲染dom, 防止由于事件循环机制导致不能一次渲染出完整的UI
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null
  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

    // 对子元素创建 fiber, 并添加 '父子关系 or 兄弟关系'
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }

  // 处理第一个子元素
  if (fiber.child) {
    return fiber.child
  }

  // 从第二个元素开始处理  (相当于不断地入栈出栈)
  let nextFiber = fiber
  while (nextFiber) {
    // 同级向后
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    // 最后一个子元素, 回到上级, 之后在处理上一级的下一个同级元素
    nextFiber = nextFiber.parent
  }
}

const Didact = {
  createElement,
  render
}

export default Didact
