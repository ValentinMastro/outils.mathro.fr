<script lang="ts">
	import BoutonsMiroir from '$lib/components/plan/BoutonsMiroir.svelte';
	import Grille from '$lib/components/plan/Grille.svelte';
	import ListeEleves from '$lib/components/plan/ListeEleves.svelte';
	import Onglets from '$lib/components/plan/Onglets.svelte';
	import { plan } from '$lib/stores/plan.svelte';
</script>

<svelte:head>
	<title>Plan de classe</title>
</svelte:head>

<div class="page">
	<header class="barre">
		<a href="/" class="retour" title="Retour aux outils">←</a>
		<h1>Plan de classe</h1>
		<Onglets />
	</header>

	{#if plan.classe}
		<div class="corps">
			<ListeEleves classe={plan.classe} />
			<main class="zone">
				<Grille classe={plan.classe} />
			</main>
		</div>
		<BoutonsMiroir />
	{:else}
		<main class="accueil">
			<p>Aucune classe pour l'instant.</p>
			<button type="button" class="btn btn-primary" onclick={() => plan.ajouterClasse('Classe 1')}
				>Créer une classe</button
			>
			<p class="aide">Double-cliquez ensuite sur l'onglet pour le renommer (ex. « 5e B »).</p>
		</main>
	{/if}
</div>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	.barre {
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		padding: 0.6rem 1rem 0;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}
	.retour {
		align-self: center;
		font-size: 1.3rem;
		color: var(--text-soft);
		padding: 0 0.3rem 0.5rem;
	}
	.retour:hover {
		color: var(--accent);
	}
	h1 {
		align-self: center;
		margin: 0 1rem 0.5rem 0;
		font-size: 1.2rem;
		color: var(--accent);
		white-space: nowrap;
	}
	.corps {
		flex: 1;
		min-height: 0;
		display: flex;
	}
	.zone {
		flex: 1;
		min-width: 0;
		padding: 1.5rem 2rem 2rem;
		/* Conteneur de taille : la grille dimensionne son texte en cqmin. */
		container-type: size;
	}
	.accueil {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.8rem;
		color: var(--text-soft);
	}
	.aide {
		font-size: 0.9rem;
	}
</style>
