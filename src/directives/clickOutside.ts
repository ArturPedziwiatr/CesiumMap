const instances = new Map()

const directive = {
  mounted,
  unmounted
}

function toggleEventListeners(action: 'add'|'remove', eventHandler: EventListenerOrEventListenerObject) {
  document[`${action}EventListener`]('click', eventHandler, true);
}

function mounted(el: HTMLElement, { value }: { value: Function }) {
  if (typeof value !== 'function') {
    console.error('Value is not a function')
    return 
  }
  const eventHandler = (event: Event) => onClickOutside(el, event, value)
  toggleEventListeners('add', eventHandler)
  instances.set(
    el,
    eventHandler
  )
}

function unmounted(el: HTMLElement) {
  const eventHandler = instances.get(el)
  toggleEventListeners('remove', eventHandler)
  instances.delete(el)
}

function onClickOutside(el: HTMLElement, event: Event, handler: Function) {
  return (event.target !== el && !el.contains(event.target as Node))
   ? handler(event, el) : null
}

export default directive