import './index.css'

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

function render(element, container) {
  // 每一个工作单元是 一个 fiber, 也就是一个 ReactElement
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

function workLoop(deadline) {
  let shouldYield = false // 是否有剩余时间
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
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

let nextUnitOfWork = null // fiber

const Didact = {
  createElement,
  render
}

/** @jsx Didact.createElement */
const container = document.getElementById('root')

const updateValue = e => {
  rerender(e.target.value)
}

const rerender = value => {
  const element = (
    <section className="section">
      <input onInput={updateValue} value={value} />
      {/* <h2>{value}</h2>
      <section>
        <header>header</header>
        <main>main</main>
      </section> */}
    </section>
  )

  console.log(element)

  Didact.render(element, container)
}

rerender('World')
