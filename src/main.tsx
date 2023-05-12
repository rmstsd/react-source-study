import './index.css'

/** @jsx Didact.createElement */

import Didact from './lib/render'

const container = document.getElementById('root')

const updateValue = e => {
  rerender(e.target.value)
}

function Counter() {
  const [state, setState] = Didact.useState(1)
  return <h1 onClick={() => setState(state + 1)}>Count: {state}</h1>
}

const rerender = value => {
  // const element = (
  //   <section className="section">
  //     <input onInput={updateValue} value={value} />
  //     <div className="div-cls">
  //       <h2>input值: {value}</h2>
  //     </div>

  //     <article>
  //       <header>header</header>
  //       <main>main</main>
  //     </article>
  //   </section>
  // )

  const element = <Counter />

  console.log(element)

  Didact.render(element, container)
}

rerender('World')
