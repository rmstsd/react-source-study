export const Text_Element_type = 'Text_Element_type'
const Placement = 'Placement'
const Update = 'Update'

function createTextELement(textContent) {
  return {
    type: Text_Element_type,
    props: { textContent, children: [] }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(item => {
        const isTextNode = typeof item === 'string' || typeof item === 'number'
        return isTextNode ? createTextELement(item) : item
      })
    }
  }
}

// work in progress
let wipRoot = null
let currentRoot = null
function render(el, container) {
  wipRoot = {
    props: {
      children: [el]
    },
    dom: container
  }

  nextWorkOfUnit = wipRoot

  console.log('fiber 树', wipRoot)
}

function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  }

  nextWorkOfUnit = wipRoot

  console.log('fiber 树', wipRoot)
}

requestIdleCallback(workLoop)

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false

  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

let deletions = []
function commitRoot() {
  deletions.forEach(commitDeletion)

  commitWork(wipRoot.child)

  currentRoot = wipRoot

  wipRoot = null
  deletions = []
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === Placement) {
    // 初始化
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  } else if (fiber.effectTag === Update) {
    // 更新
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let nextWorkOfUnit = null

function createDom(fiber) {
  return fiber.type === Text_Element_type ? document.createTextNode('') : document.createElement(fiber.type)
}

function updateProps(dom: HTMLElement, nextProps, prevProps) {
  // 1. old 有, new 没有 删除
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })

  // 2. new 有, old 没有 添加
  // 3. new 有, old 有 修改
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase()

          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child

  // 设置 fiber 指针
  let prevChild = null
  children.forEach((item, index) => {
    const isSameType = oldFiber && oldFiber.type === item.type

    let newFiber
    if (isSameType) {
      newFiber = {
        type: item.type,
        props: item.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: Update,
        alternate: oldFiber
      }
    } else {
      newFiber = {
        type: item.type,
        props: item.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: Placement
      }

      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }

    prevChild = newFiber
  })
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
  // 创建dom, 设置 props
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber))

    updateProps(dom, fiber.props, {})
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 返回下一个 fiber
  if (fiber.child) {
    return fiber.child
  }

  // if (fiber.sibling) {
  //   return fiber.sibling
  // }

  let nextFiber = fiber

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber.parent
  }
}

const React = {
  createElement,
  render,
  update
}

export default React
