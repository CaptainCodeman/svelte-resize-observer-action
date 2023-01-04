<script lang="ts">
	import { resize } from '$lib'

	let width: number
	let height: number

	function myaction(node: HTMLElement) {
		const resizeManager = resize(node, entry => {
			width = entry.contentRect.width
			height = entry.contentRect.height
		})

		return {
			destroy() {
				resizeManager.destroy()
			},
		}
	}
</script>

<div use:myaction>
	{#if width && height}
		{width}w x {height}h
	{/if}
</div>

<style>
	div {
		font-family: Arial, Helvetica, sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
