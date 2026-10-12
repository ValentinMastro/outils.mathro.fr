<script lang="ts">
	import { tick } from 'svelte';
	import { plan } from '$lib/stores/plan.svelte';

	let enEdition = $state<string | null>(null);
	let saisie = $state('');
	let champ = $state<HTMLInputElement>();

	async function editer(id: string, nom: string) {
		enEdition = id;
		saisie = nom;
		await tick();
		champ?.select();
	}

	function valider() {
		if (enEdition) plan.renommerClasse(enEdition, saisie);
		enEdition = null;
	}

	function nouvelle() {
		plan.ajouterClasse(`Classe ${plan.state.classes.length + 1}`);
		const c = plan.classe;
		if (c) editer(c.id, c.nom);
	}

	function supprimer(id: string, nom: string) {
		if (confirm(`Supprimer la classe « ${nom} » et sa liste d'élèves ?`)) plan.supprimerClasse(id);
	}
</script>

<nav class="onglets" aria-label="Classes">
	{#each plan.state.classes as c (c.id)}
		{@const actif = c.id === plan.classe?.id}
		<div class="onglet" class:actif>
			{#if enEdition === c.id}
				<input
					bind:this={champ}
					bind:value={saisie}
					class="renommer"
					aria-label="Nom de la classe"
					onblur={valider}
					onkeydown={(e) => {
						if (e.key === 'Enter') valider();
						if (e.key === 'Escape') enEdition = null;
					}}
				/>
			{:else}
				<button
					type="button"
					class="nom"
					title="Double-clic pour renommer"
					onclick={() => plan.choisirClasse(c.id)}
					ondblclick={() => editer(c.id, c.nom)}>{c.nom}</button
				>
				{#if actif}
					<button
						type="button"
						class="fermer"
						title="Supprimer la classe"
						aria-label="Supprimer la classe {c.nom}"
						onclick={() => supprimer(c.id, c.nom)}>×</button
					>
				{/if}
			{/if}
		</div>
	{/each}
	<button type="button" class="ajouter" title="Nouvelle classe" onclick={nouvelle}>+</button>
</nav>

<style>
	.onglets {
		display: flex;
		align-items: flex-end;
		gap: 0.3rem;
		overflow-x: auto;
	}
	.onglet {
		display: flex;
		align-items: center;
		border: 1px solid transparent;
		border-bottom: none;
		border-radius: 10px 10px 0 0;
		color: var(--text-soft);
	}
	.onglet.actif {
		background: var(--bg);
		border-color: var(--border);
		color: var(--accent);
	}
	.nom,
	.fermer,
	.ajouter {
		border: none;
		background: transparent;
		color: inherit;
		font-weight: 600;
	}
	.nom {
		padding: 0.6rem 1rem;
		white-space: nowrap;
	}
	.onglet:not(.actif) .nom:hover {
		color: var(--text);
	}
	.fermer {
		padding: 0 0.7rem 0 0;
		font-size: 1.1rem;
		color: var(--text-soft);
		opacity: 0.5;
	}
	.fermer:hover {
		opacity: 1;
		color: #ef4444;
	}
	.renommer {
		margin: 0.3rem;
		width: 9rem;
		padding: 0.3rem 0.6rem;
		font: inherit;
		font-weight: 600;
		border: 1px solid var(--accent);
		border-radius: 6px;
	}
	.ajouter {
		padding: 0.5rem 0.9rem;
		font-size: 1.2rem;
		color: var(--text-soft);
		border-radius: 8px;
		margin-bottom: 0.2rem;
	}
	.ajouter:hover {
		color: var(--accent);
		background: var(--accent-soft);
	}
</style>
