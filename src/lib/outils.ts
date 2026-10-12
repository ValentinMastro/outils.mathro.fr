// Catalogue des outils affichés sur la page d'accueil.
// Ajouter un outil = une entrée ici + une route src/routes/<slug>/.

export type Outil = {
	slug: string;
	titre: string;
	description: string;
	/** Couleur de la carte : variable CSS de la charte (cf. app.css). */
	couleur: 'bleu' | 'vert' | 'rouge';
};

export const outils: Outil[] = [
	{
		slug: 'plan-de-classe',
		titre: 'Plan de classe',
		description:
			'Placer les élèves sur les tables par glisser-déposer, une classe par onglet, avec miroir pour la projection.',
		couleur: 'bleu'
	}
];
