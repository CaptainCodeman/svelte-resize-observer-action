# svelte-resize-observer-action

Svelte use:action for element resize notifications using ResizeObserver.

Small. Efficient. SSR Friendly.

## Purpose

You need to know when an Element changes size, as efficiently as possible, adding as few bytes to your project as possible.

The existing packages I looked at all had one or more issues:

- Not SSR compatible. Likely developed before SvelteKit, when Svelte was primarily used for client-side components.
- Used a Svelte Component as a wrapper. This adds unnecessary overhead and bytes to your bundle.
- Included polyfills. Again, this adds extra unnecessary bytes and [ResizeObserver is now supported by all browsers](https://caniuse.com/resizeobserver) that matter.
- Dispatch events. IMO this is also unnecessary and wasted bytes. A callback passed in to an action is simpler and more efficient.
- Create a ResizeObserver instance per element. Slightly less efficient and a potential waste of runtime resources, especially if many elements need to be observed, vs using a single observer as intended.
- Only provide simple (rounded) CSS pixel dimensions, not the [complete set of ResizeObserverEntry properties](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry).
- Lack of TypeScript support.

This package is simple, fast and efficient. It is only 231 bytes minified, 195 bytes minified and gzipped. This is the built output, all it adds to your app:

```js
var r=new WeakMap,s;function b(e,t){return s=s||new ResizeObserver(i=>{for(let l of i){let n=r.get(l.target);n&&n(l)}}),r.set(e,t),s.observe(e),{destroy(){s.unobserve(e),r.delete(e)}}}export{b as resize};
```

## Usage

Import using your package manager of choice, e.g.:

    pnpm i svelte-resize-observer-action

### Within a Svelte Component

Import and apply to your HTML element. Provide the function that will be called with the `ResizeObserverEntry` object.

```svelte
<script lang="ts">
  import { resize } from 'svelte-resize-observer-action'

  let width: number
  let height: number

  function onResize(entry: ResizeObserverEntry) {
    width = entry.contentRect.width
    height = entry.contentRect.height
  }
</script>

<div use:resize={onResize}>
  {width}w x {height}h
</div>
```

### Within another Svelte `use:action`

Import inside your `use:action` module:

```ts
import { resize } from 'svelte-resize-observer-action'
```

Apply to the element passed in to your `use:action` and call the `destroy` method when your action is destroyed:

```ts
type Render = (ctx: CanvasRenderingContext2D) => void

export function panzoom(canvas: HTMLCanvasElement, render: Render) {
  const ctx = canvas.getContext('2d')!

  // use resize action to watch element size
  const resizeManager = resize(canvas, entry => {
    // handle canvas size change and re-render
    render(ctx)
  })

  // rest of use:action implementation

  return {
    destroy() {
      // remember to call destroy when this action is destroyed
      resizeManager.destroy()
    },
  }
}
```
