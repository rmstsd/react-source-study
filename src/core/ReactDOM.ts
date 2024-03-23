import React from './React'

const ReactDOM = {
  createRoot(container: HTMLElement) {
    return {
      render(element) {
        React.render(element, container)
      }
    }
  }
}

export default ReactDOM
