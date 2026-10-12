<script lang="ts">
	import type { Eleve } from '$lib/plan';
	import { accepterGlisser, commencerGlisser, eleveDepose } from './dnd';

	let {
		eleve,
		deplie,
		onbasculer,
		ondeposer
	}: {
		eleve: Eleve | undefined;
		deplie: boolean;
		onbasculer: () => void;
		ondeposer: (eleveId: string) => void;
	} = $props();

	let survol = $state(false);
</script>

<button
	type="button"
	class="place"
	class:vide={!eleve}
	class:survol
	draggable={!!eleve}
	aria-label={eleve ? `${eleve.prenom} ${eleve.nom}` : 'Place libre'}
	onclick={() => eleve && onbasculer()}
	ondragstart={(e) => eleve && commencerGlisser(e, eleve.id)}
	ondragenter={(e) => (survol = accepterGlisser(e))}
	ondragover={(e) => (survol = accepterGlisser(e))}
	ondragleave={(e) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) survol = false;
	}}
	ondrop={(e) => {
		survol = false;
		const id = eleveDepose(e);
		if (id) ondeposer(id);
	}}
>
	{#if eleve}
		<span class="prenom">{eleve.prenom || eleve.nom}</span>
		{#if deplie && eleve.prenom && eleve.nom}
			<span class="nom">{eleve.nom}</span>
		{/if}
	{/if}
</button>

<style>
	.place {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.15em;
		padding: 0.3em 0.4em;
		border: none;
		background: transparent;
		color: var(--text);
		font: inherit;
		text-align: center;
		line-height: 1.15;
		cursor: grab;
		transition: background 0.12s ease;
	}
	.place.vide {
		cursor: default;
	}
	.place.vide::after {
		content: '';
		width: 70%;
		height: 60%;
		border: 2px dashed var(--border);
		border-radius: 8px;
	}
	.place.survol {
		background: var(--accent-soft);
	}
	.place.survol.vide::after {
		border-color: var(--accent);
	}
	.prenom {
		font-weight: 600;
		max-width: 100%;
		overflow-wrap: anywhere;
	}
	.nom {
		font-size: 0.75em;
		color: var(--text-soft);
		text-transform: uppercase;
		letter-spacing: 0.02em;
		max-width: 100%;
		overflow-wrap: anywhere;
	}
	.place:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: -3px;
	}
</style>
