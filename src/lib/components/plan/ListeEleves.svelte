<script lang="ts">
	import { tick } from 'svelte';
	import { comparerEleves, type Classe } from '$lib/plan';
	import { plan } from '$lib/stores/plan.svelte';
	import { accepterGlisser, commencerGlisser, eleveDepose } from './dnd';

	let { classe }: { classe: Classe } = $props();

	const eleves = $derived([...classe.eleves].sort(comparerEleves));
	const assis = $derived(new Set(classe.places.filter((p): p is string => !!p)));

	// Ajout d'un élève
	let nom = $state('');
	let prenom = $state('');
	let champNom = $state<HTMLInputElement>();

	function ajouter(e: SubmitEvent) {
		e.preventDefault();
		plan.ajouterEleve(nom, prenom);
		nom = prenom = '';
		champNom?.focus();
	}

	// Collage d'une liste
	let collage = $state(false);
	let texte = $state('');

	function importer() {
		plan.ajouterEleves(texte);
		texte = '';
		collage = false;
	}

	// Modification d'un élève (double-clic)
	let enEdition = $state<string | null>(null);
	let editNom = $state('');
	let editPrenom = $state('');
	let champEdit = $state<HTMLInputElement>();

	async function editer(id: string, n: string, p: string) {
		enEdition = id;
		editNom = n;
		editPrenom = p;
		await tick();
		champEdit?.focus();
	}

	function validerEdition(e: SubmitEvent) {
		e.preventDefault();
		if (enEdition)
			plan.modifierEleve(enEdition, { nom: editNom.trim(), prenom: editPrenom.trim() });
		enEdition = null;
	}

	// Déposer un élève de la grille sur la liste le retire du plan.
	let survol = $state(false);

	function vider() {
		if (confirm('Retirer tous les élèves du plan ? (la liste est conservée)')) plan.viderPlan();
	}
</script>

<aside
	class="liste"
	class:survol
	ondragenter={(e) => (survol = accepterGlisser(e))}
	ondragover={(e) => (survol = accepterGlisser(e))}
	ondragleave={(e) => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) survol = false;
	}}
	ondrop={(e) => {
		survol = false;
		const id = eleveDepose(e);
		if (id) plan.retirer(id);
	}}
>
	<header class="entete">
		<h2>Élèves</h2>
		<span class="compte">{assis.size} / {eleves.length} placés</span>
	</header>

	<form class="ajout" onsubmit={ajouter}>
		<input bind:this={champNom} bind:value={nom} placeholder="Nom" aria-label="Nom" />
		<input bind:value={prenom} placeholder="Prénom" aria-label="Prénom" />
		<button type="submit" class="btn btn-primary" disabled={!nom.trim() && !prenom.trim()}
			>Ajouter</button
		>
	</form>

	{#if collage}
		<div class="collage">
			<textarea
				bind:value={texte}
				rows="6"
				placeholder={'Un élève par ligne :\nDUPONT Marie\nMartin;Léa'}
				aria-label="Liste d'élèves à coller"></textarea>
			<div class="actions">
				<button type="button" class="btn btn-ghost" onclick={() => (collage = false)}
					>Annuler</button
				>
				<button type="button" class="btn btn-primary" disabled={!texte.trim()} onclick={importer}
					>Importer</button
				>
			</div>
		</div>
	{:else}
		<button type="button" class="lien" onclick={() => (collage = true)}>Coller une liste…</button>
	{/if}

	<ul class="eleves">
		{#each eleves as e (e.id)}
			<li class:assis={assis.has(e.id)}>
				{#if enEdition === e.id}
					<form class="edition" onsubmit={validerEdition}>
						<input bind:this={champEdit} bind:value={editNom} aria-label="Nom" />
						<input bind:value={editPrenom} aria-label="Prénom" />
						<button type="submit" class="btn btn-primary">OK</button>
					</form>
				{:else}
					<!-- Glisser-déposer à la souris, pensé pour l'ordinateur de la classe. -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="eleve"
						draggable="true"
						title="Glisser sur une place · double-clic pour modifier"
						ondragstart={(ev) => commencerGlisser(ev, e.id)}
						ondblclick={() => editer(e.id, e.nom, e.prenom)}
					>
						<span class="pastille" aria-hidden="true"></span>
						<span class="texte"><span class="nom">{e.nom}</span> {e.prenom}</span>
						<button
							type="button"
							class="suppr"
							title="Supprimer l'élève"
							aria-label="Supprimer {e.prenom} {e.nom}"
							onclick={() => plan.supprimerEleve(e.id)}>×</button
						>
					</div>
				{/if}
			</li>
		{:else}
			<li class="vide">Aucun élève pour l'instant.</li>
		{/each}
	</ul>

	{#if assis.size > 0}
		<button type="button" class="lien discret" onclick={vider}>Vider le plan</button>
	{/if}
</aside>

<style>
	.liste {
		width: var(--sidebar-w);
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 1.2rem 1rem;
		background: var(--surface);
		border-right: 1px solid var(--border);
		overflow-y: auto;
		transition: background 0.12s ease;
	}
	.liste.survol {
		background: var(--accent-soft);
	}
	.entete {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	h2 {
		margin: 0;
		font-size: 1.15rem;
	}
	.compte {
		font-size: 0.85rem;
		color: var(--text-soft);
	}
	.ajout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.4rem;
	}
	.ajout .btn {
		grid-column: 1 / -1;
		padding: 0.45rem;
	}
	input,
	textarea {
		font: inherit;
		min-width: 0;
		padding: 0.45rem 0.6rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--surface-2);
		color: var(--text);
	}
	input:focus,
	textarea:focus {
		outline: 2px solid var(--accent);
		outline-offset: -1px;
		background: var(--surface);
	}
	textarea {
		width: 100%;
		resize: vertical;
	}
	.collage .actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.4rem;
		margin-top: 0.4rem;
	}
	.collage .btn {
		padding: 0.4rem 0.8rem;
	}
	.lien {
		align-self: flex-start;
		border: none;
		background: none;
		padding: 0;
		color: var(--accent);
		font-size: 0.9rem;
	}
	.lien:hover {
		text-decoration: underline;
	}
	.lien.discret {
		color: var(--text-soft);
		margin-top: auto;
	}
	.eleves {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.eleve {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.5rem;
		border-radius: 8px;
		cursor: grab;
	}
	.eleve:hover {
		background: var(--surface-2);
	}
	.pastille {
		width: 9px;
		height: 9px;
		flex: 0 0 auto;
		border-radius: 50%;
		border: 2px solid var(--border);
	}
	.assis .pastille {
		background: var(--vert);
		border-color: var(--vert);
	}
	.assis .texte {
		color: var(--text-soft);
	}
	.texte {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.nom {
		text-transform: uppercase;
		font-weight: 600;
	}
	.suppr {
		border: none;
		background: none;
		color: var(--text-soft);
		font-size: 1.1rem;
		line-height: 1;
		padding: 0 0.2rem;
		opacity: 0;
	}
	.eleve:hover .suppr,
	.suppr:focus-visible {
		opacity: 0.6;
	}
	.suppr:hover {
		opacity: 1;
		color: #ef4444;
	}
	.edition {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 0.3rem;
	}
	.edition .btn {
		padding: 0.3rem 0.6rem;
	}
	.vide {
		color: var(--text-soft);
		font-size: 0.9rem;
		padding: 0.4rem 0.5rem;
	}
</style>
