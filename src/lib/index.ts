// keep track of which resize callback is associated with each element
type ResizeCallback = (entry: ResizeObserverEntry) => void
const resizeCallbacks = new WeakMap<Element, ResizeCallback>()

// defined outside of action, so we only create a single instance
let resizeObserver: ResizeObserver

export function resize(target: Element, callback: ResizeCallback) {
  // create on first use, inside the action, so we're SSR friendly
  resizeObserver = resizeObserver || new ResizeObserver(entries => {
    for (const entry of entries) {
      const callback = resizeCallbacks.get(entry.target)
      if (callback) {
        callback(entry)
      }
    }
  })

  resizeCallbacks.set(target, callback)
  resizeObserver.observe(target)

  return {
    destroy() {
      resizeObserver.unobserve(target)
      resizeCallbacks.delete(target)
    }
  }
}