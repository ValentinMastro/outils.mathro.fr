<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import {
		indexPlace,
		PLACES_PAR_TABLE,
		RANGEES,
		TABLES_PAR_RANGEE,
		type Classe,
		type Eleve
	} from '$lib/plan';
	import { plan } from '$lib/stores/plan.svelte';
	import Place from './Place.svelte';

	let { classe }: { classe: Classe } = $props();

	const suite = (n: number) => Array.from({ length: n }, (_, i) => i);

	// Le miroir réordonne l'affichage au lieu de retourner la grille en CSS :
	// le texte reste ainsi toujours à l'endroit.
	const rangees = $derived(plan.state.miroirV ? suite(RANGEES).reverse() : suite(RANGEES));
	const tables = $derived(
		plan.state.miroirH ? suite(TABLES_PAR_RANGEE).reverse() : suite(TABLES_PAR_RANGEE)
	);
	const cotes = $derived(
		plan.state.miroirH ? suite(PLACES_PAR_TABLE).reverse() : suite(PLACES_PAR_TABLE)
	);

	const parId = $derived(new Map<string, Eleve>(classe.eleves.map((e) => [e.id, e])));

	// Élèves dont on affiche le nom complet (état d'affichage, non enregistré).
	const deplies = new SvelteSet<string>();

	function basculer(id: string) {
		if (deplies.has(id)) deplies.delete(id);
		else deplies.add(id);
	}
</script>

{#snippet tableau()}
	<div class="tableau">Tableau</div>
{/snippet}

<div class="salle">
	{#if !plan.state.miroirV}{@render tableau()}{/if}

	<div class="rangees">
		{#each rangees as r (r)}
			<div class="rangee">
				{#each tables as t (t)}
					<div class="table">
						{#each cotes as c (c)}
							{@const i = indexPlace(r, t, c)}
							{@const id = classe.places[i]}
							{@const eleve = id ? parId.get(id) : undefined}
							<Place
								{eleve}
								deplie={!!eleve && deplies.has(eleve.id)}
								onbasculer={() => eleve && basculer(eleve.id)}
								ondeposer={(eleveId) => plan.placer(eleveId, i)}
							/>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if plan.state.miroirV}{@render tableau()}{/if}
</div>

<style>
	.salle {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 2.5cqmin;
		/* Texte proportionnel à la zone de la salle (le parent est un conteneur
		   de taille, cf. la page) : lisible une fois projeté. */
		font-size: clamp(0.8rem, 3cqmin, 2.4rem);
	}
	.tableau {
		align-self: center;
		width: 45%;
		padding: 0.35em 0;
		text-align: center;
		font-size: 0.7em;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--text-soft);
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: 8px;
	}
	.rangees {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-rows: repeat(4, 1fr);
		gap: 3cqmin;
	}
	.rangee {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 3cqmin;
	}
	.table {
		display: flex;
		min-height: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		overflow: hidden;
	}
	.table > :global(.place + .place) {
		border-left: 1px solid var(--border);
	}
</style>
