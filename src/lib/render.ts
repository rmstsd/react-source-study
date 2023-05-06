import createElement from './createElement'

function createDom(fiber) {
  const dom = fiber.type == 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

  updateDom(dom, {}, fiber.props)

  return dom
}

const isEvent = key => key.startsWith('on')
const isProperty = key => key !== 'children' && !isEvent(key)
const isNew = (prev, next) => key => prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)

function updateDom(dom, prevProps, nextProps) {
  // 移除旧的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ''
    })

  // 添加新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  // 添加事件监听
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  const domParent = fiber.parent.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom)
  }

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
    },
    alternate: currentRoot
  }

  deletions = []
  nextUnitOfWork = wipRoot
}

let wipRoot = null
let currentRoot = null
let nextUnitOfWork = null // fiber
let deletions = null

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
  reconcileChildren(fiber, elements)

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

function reconcileChildren(wipFiber, elements) {
  let index = 0

  let oldFiber = wipFiber.alternate && wipFiber.alternate.child

  let prevSibling = null
  while (index < elements.length || oldFiber != null) {
    const element = elements[index]

    let newFiber = null

    const sameType = oldFiber && element && element.type == oldFiber.type

    if (sameType) {
      // 更新dom
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }
    if (element && !sameType) {
      // 添加新的dom
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }
    if (oldFiber && !sameType) {
      // 删除旧的dom
      oldFiber.effectTag = 'DELETION'
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    // const newFiber = {
    //   type: element.type,
    //   props: element.props,
    //   parent: wipFiber,
    //   dom: null
    // }

    // 对子元素创建 fiber, 并添加 '父子关系 or 兄弟关系'
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

const Didact = {
  createElement,
  render
}

export default Didact
