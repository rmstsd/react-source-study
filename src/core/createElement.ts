export const Text_Element_type = 'Text_Element_type'
export const Placement = 'Placement'
export const Update = 'Update'

function createTextElement(textContent) {
  return {
    type: Text_Element_type,
    props: { textContent, children: [] }
  }
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(item => {
        const isTextNode = typeof item === 'string' || typeof item === 'number'
        return isTextNode ? createTextElement(item) : item
      })
    }
  }
}

export function createDom(fiber) {
  return fiber.type === Text_Element_type ? document.createTextNode('') : document.createElement(fiber.type)
}
