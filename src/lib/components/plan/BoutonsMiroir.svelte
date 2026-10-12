<script lang="ts">
	import { plan } from '$lib/stores/plan.svelte';
</script>

<div class="miroirs">
	<button
		type="button"
		class="btn btn-ghost"
		class:actif={plan.state.miroirH}
		title="Miroir horizontal (gauche ↔ droite)"
		aria-pressed={plan.state.miroirH}
		onclick={() => plan.basculerMiroirH()}>⇆</button
	>
	<button
		type="button"
		class="btn btn-ghost"
		class:actif={plan.state.miroirV}
		title="Miroir vertical (tableau en haut ↔ en bas)"
		aria-pressed={plan.state.miroirV}
		onclick={() => plan.basculerMiroirV()}>⇅</button
	>
</div>

<style>
	.miroirs {
		position: fixed;
		right: 0.8rem;
		bottom: 0.8rem;
		display: flex;
		gap: 0.2rem;
		opacity: 0.35;
		transition: opacity 0.15s ease;
	}
	.miroirs:hover,
	.miroirs:focus-within {
		opacity: 1;
	}
	.btn {
		width: 2.4rem;
		height: 2.4rem;
		padding: 0;
		font-size: 1.2rem;
		color: var(--text-soft);
	}
	.btn:hover {
		background: var(--surface);
	}
	.btn.actif {
		color: var(--accent);
	}
</style>
