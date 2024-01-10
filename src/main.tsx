import ReactDom from './react-dom.development'
import React from './react.development'

// ReactDom.render(<App />, document.querySelector('#root'))

const root = ReactDom.createRoot(document.querySelector('#root'))

root.render(<App />)

function App() {
  return <div>134</div>
}
