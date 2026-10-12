<script lang="ts">
	import { outils } from '$lib/outils';
</script>

<svelte:head>
	<title>Outils pour la classe</title>
</svelte:head>

<div class="hub">
	<header class="hero">
		<h1>Outils pour la classe</h1>
		<p class="sub">
			Petits outils de gestion de classe. Les données restent enregistrées dans ce navigateur, sur
			cet ordinateur.
		</p>
	</header>

	<div class="grid">
		{#each outils as o (o.slug)}
			<a href="/{o.slug}" class="outil-card" style:--couleur="var(--{o.couleur})">
				<h2 class="outil-title">{o.titre}</h2>
				<p class="outil-desc">{o.description}</p>
			</a>
		{/each}
	</div>
</div>

<style>
	/* Même rendu que les cartes de mathro.fr (site/index.html). */
	.hub {
		max-width: 1200px;
		margin: 0 auto;
		padding: 5rem 2rem 4rem;
	}
	.hero {
		margin-bottom: 2.5rem;
	}
	.hero h1 {
		margin: 0;
		font-size: 3.2rem;
		color: var(--accent);
	}
	.sub {
		color: var(--text-soft);
		font-size: 1.25rem;
		margin: 0.5rem 0 0;
		max-width: 640px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}
	.outil-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-top: 4px solid var(--couleur);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		min-height: 13rem;
		padding: 2rem 2rem 1.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		transition:
			transform 0.08s ease,
			box-shadow 0.15s ease;
	}
	.outil-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(16, 24, 40, 0.1);
	}
	.outil-card:focus-visible {
		outline: 3px solid var(--couleur);
		outline-offset: 3px;
	}
	.outil-title {
		margin: 0;
		font-size: 1.9rem;
		color: var(--couleur);
	}
	.outil-desc {
		margin: 0;
		color: var(--text-soft);
		font-size: 1.1rem;
		line-height: 1.5;
	}
	@media (max-width: 800px) {
		.hub {
			padding: 2.5rem 1.2rem 3rem;
		}
		.hero h1 {
			font-size: 2.2rem;
		}
	}
</style>
