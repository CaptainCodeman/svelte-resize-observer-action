<script lang="ts">
	import { resize } from '$lib'

	let width: number
	let height: number

	function onResize(entry: ResizeObserverEntry) {
		;({ width, height } = entry.contentRect)
	}
</script>

<main use:resize={onResize}>
	{#if width && height}
		<div>
			<h1>Svelte Resize Observer Action</h1>
			<p>Resize the browser window ...</p>

			<p>{width}w x {height}h</p>
		</div>
	{/if}
</main>

<style>
	h1 {
		font-size: 18px;
	}
	main {
		font-family: Arial, Helvetica, sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
