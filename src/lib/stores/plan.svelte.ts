import { browser } from '$app/environment';
import {
	analyserListe,
	nouvelId,
	placer,
	placesVides,
	retirer,
	type Classe,
	type Eleve
} from '../plan';

const KEY = 'outils:v1:plan-classe';

export type EtatPlan = {
	classes: Classe[];
	classeActive: string | null;
	miroirH: boolean;
	miroirV: boolean;
};

function etatInitial(): EtatPlan {
	return { classes: [], classeActive: null, miroirH: false, miroirV: false };
}

function load(): EtatPlan {
	if (!browser) return etatInitial();
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? { ...etatInitial(), ...(JSON.parse(raw) as EtatPlan) } : etatInitial();
	} catch {
		return etatInitial();
	}
}

class PlanStore {
	state = $state<EtatPlan>(load());

	/** Classe affichée (ou undefined s'il n'y en a aucune). */
	get classe(): Classe | undefined {
		return (
			this.state.classes.find((c) => c.id === this.state.classeActive) ?? this.state.classes[0]
		);
	}

	private persist() {
		if (!browser) return;
		try {
			localStorage.setItem(KEY, JSON.stringify(this.state));
		} catch {
			/* quota / mode privé : on ignore silencieusement */
		}
	}

	/* --- Classes ------------------------------------------------------------ */

	ajouterClasse(nom: string) {
		const classe: Classe = {
			id: nouvelId(),
			nom: nom.trim() || 'Classe',
			eleves: [],
			places: placesVides()
		};
		this.state.classes.push(classe);
		this.state.classeActive = classe.id;
		this.persist();
	}

	renommerClasse(id: string, nom: string) {
		const c = this.state.classes.find((c) => c.id === id);
		if (!c || !nom.trim()) return;
		c.nom = nom.trim();
		this.persist();
	}

	supprimerClasse(id: string) {
		this.state.classes = this.state.classes.filter((c) => c.id !== id);
		if (this.state.classeActive === id) this.state.classeActive = this.state.classes[0]?.id ?? null;
		this.persist();
	}

	choisirClasse(id: string) {
		this.state.classeActive = id;
		this.persist();
	}

	/* --- Élèves (de la classe active) --------------------------------------- */

	ajouterEleve(nom: string, prenom: string) {
		const c = this.classe;
		if (!c || (!nom.trim() && !prenom.trim())) return;
		c.eleves.push({ id: nouvelId(), nom: nom.trim(), prenom: prenom.trim() });
		this.persist();
	}

	/** Ajoute une liste collée ; renvoie le nombre d'élèves ajoutés. */
	ajouterEleves(texte: string): number {
		const c = this.classe;
		if (!c) return 0;
		const liste = analyserListe(texte);
		for (const { nom, prenom } of liste) c.eleves.push({ id: nouvelId(), nom, prenom });
		this.persist();
		return liste.length;
	}

	modifierEleve(id: string, champs: Partial<Omit<Eleve, 'id'>>) {
		const e = this.classe?.eleves.find((e) => e.id === id);
		if (!e) return;
		Object.assign(e, champs);
		this.persist();
	}

	supprimerEleve(id: string) {
		const c = this.classe;
		if (!c) return;
		retirer(c.places, id);
		c.eleves = c.eleves.filter((e) => e.id !== id);
		this.persist();
	}

	/* --- Plan --------------------------------------------------------------- */

	placer(eleveId: string, place: number) {
		const c = this.classe;
		if (!c) return;
		placer(c.places, eleveId, place);
		this.persist();
	}

	retirer(eleveId: string) {
		const c = this.classe;
		if (!c) return;
		retirer(c.places, eleveId);
		this.persist();
	}

	viderPlan() {
		const c = this.classe;
		if (!c) return;
		c.places = placesVides();
		this.persist();
	}

	basculerMiroirH() {
		this.state.miroirH = !this.state.miroirH;
		this.persist();
	}

	basculerMiroirV() {
		this.state.miroirV = !this.state.miroirV;
		this.persist();
	}
}

export const plan = new PlanStore();
