import './index.css'

/** @jsx Didact.createElement */

import Didact from './lib/render'

const container = document.getElementById('root')

const updateValue = e => {
  rerender(e.target.value)
}

const rerender = value => {
  const element = (
    <section className="section">
      <input onInput={updateValue} value={value} />
      <div className="div-cls">
        <h2>input值: {value}</h2>
      </div>

      <article>
        <header>header</header>
        <main>main</main>
      </article>
    </section>
  )

  console.log(element)

  Didact.render(element, container)
}

rerender('World')
