// Logique pure du plan de classe : aucune dépendance à Svelte ni au navigateur,
// pour pouvoir la tester simplement (cf. plan.test.ts).

export const RANGEES = 4;
export const TABLES_PAR_RANGEE = 4;
export const PLACES_PAR_TABLE = 2;
export const NB_PLACES = RANGEES * TABLES_PAR_RANGEE * PLACES_PAR_TABLE;

export type Eleve = { id: string; nom: string; prenom: string };

export type Classe = {
	id: string;
	nom: string;
	eleves: Eleve[];
	/** Une entrée par place : id de l'élève assis ou null. */
	places: (string | null)[];
};

/** Index d'une place : rangée (0 = devant), table (0 = gauche), côté (0 = gauche). */
export function indexPlace(rangee: number, table: number, cote: number): number {
	return (rangee * TABLES_PAR_RANGEE + table) * PLACES_PAR_TABLE + cote;
}

export function placesVides(): (string | null)[] {
	return Array(NB_PLACES).fill(null);
}

export function nouvelId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Assoit un élève sur une place. S'il était déjà assis ailleurs, il quitte son
 * ancienne place ; si la place visée est occupée, son occupant prend l'ancienne
 * place de l'élève (échange), ou retourne dans la liste si l'élève n'était pas assis.
 */
export function placer(places: (string | null)[], eleveId: string, cible: number): void {
	const origine = places.indexOf(eleveId);
	if (origine === cible) return;
	const occupant = places[cible];
	if (origine !== -1) places[origine] = occupant;
	places[cible] = eleveId;
}

export function retirer(places: (string | null)[], eleveId: string): void {
	const i = places.indexOf(eleveId);
	if (i !== -1) places[i] = null;
}

/** Ordre alphabétique par nom puis prénom, insensible à la casse et aux accents. */
export function comparerEleves(a: Eleve, b: Eleve): number {
	const opts = { sensitivity: 'base' } as const;
	return a.nom.localeCompare(b.nom, 'fr', opts) || a.prenom.localeCompare(b.prenom, 'fr', opts);
}

/**
 * Découpe une liste collée (une ligne par élève) en couples nom / prénom.
 * Formats acceptés :
 *   - « Nom;Prénom », « Nom,Prénom » ou « Nom<tab>Prénom » ;
 *   - « NOM Prénom » (style Pronote) : les mots en majuscules forment le nom ;
 *   - sinon, dernier mot = prénom, le reste = nom.
 */
export function analyserListe(texte: string): { nom: string; prenom: string }[] {
	const resultat: { nom: string; prenom: string }[] = [];
	for (const brut of texte.split(/\r?\n/)) {
		const ligne = brut.trim();
		if (!ligne) continue;

		const sep = ligne.match(/[;\t,]/);
		if (sep) {
			const [nom, ...reste] = ligne.split(sep[0]);
			resultat.push({ nom: nom.trim(), prenom: reste.join(' ').trim() });
			continue;
		}

		const mots = ligne.split(/\s+/);
		if (mots.length === 1) {
			resultat.push({ nom: '', prenom: mots[0] });
			continue;
		}
		const estMajuscule = (m: string) => /\p{L}/u.test(m) && m === m.toLocaleUpperCase('fr');
		let n = 0;
		while (n < mots.length - 1 && estMajuscule(mots[n])) n++;
		if (n === 0) n = mots.length - 1;
		resultat.push({ nom: mots.slice(0, n).join(' '), prenom: mots.slice(n).join(' ') });
	}
	return resultat;
}
