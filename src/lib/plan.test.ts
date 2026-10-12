import { describe, expect, it } from 'vitest';
import { analyserListe, indexPlace, NB_PLACES, placer, placesVides, retirer } from './plan';

describe('placer', () => {
	it('assoit un élève sur une place vide', () => {
		const p = placesVides();
		placer(p, 'a', 3);
		expect(p[3]).toBe('a');
		expect(p.filter(Boolean)).toHaveLength(1);
	});

	it('déplace un élève déjà assis', () => {
		const p = placesVides();
		placer(p, 'a', 3);
		placer(p, 'a', 10);
		expect(p[3]).toBeNull();
		expect(p[10]).toBe('a');
	});

	it('échange deux élèves assis', () => {
		const p = placesVides();
		placer(p, 'a', 1);
		placer(p, 'b', 2);
		placer(p, 'a', 2);
		expect(p[1]).toBe('b');
		expect(p[2]).toBe('a');
	});

	it("renvoie l'occupant dans la liste si l'élève venait de la liste", () => {
		const p = placesVides();
		placer(p, 'b', 2);
		placer(p, 'a', 2);
		expect(p[2]).toBe('a');
		expect(p.includes('b')).toBe(false);
	});
});

describe('retirer', () => {
	it('libère la place', () => {
		const p = placesVides();
		placer(p, 'a', 5);
		retirer(p, 'a');
		expect(p[5]).toBeNull();
	});
});

describe('indexPlace', () => {
	it('couvre les 32 places sans collision', () => {
		const vus = new Set<number>();
		for (let r = 0; r < 4; r++)
			for (let t = 0; t < 4; t++) for (let c = 0; c < 2; c++) vus.add(indexPlace(r, t, c));
		expect(vus.size).toBe(NB_PLACES);
		expect(Math.max(...vus)).toBe(NB_PLACES - 1);
	});
});

describe('analyserListe', () => {
	it('gère le format Pronote « NOM Prénom »', () => {
		expect(analyserListe('DUPONT Marie\nDE LA FONTAINE Jean-Pierre\n\n')).toEqual([
			{ nom: 'DUPONT', prenom: 'Marie' },
			{ nom: 'DE LA FONTAINE', prenom: 'Jean-Pierre' }
		]);
	});

	it('gère les séparateurs ; , et tabulation', () => {
		expect(analyserListe('Martin;Léa\nBernard, Hugo\nPetit\tAnna Lou')).toEqual([
			{ nom: 'Martin', prenom: 'Léa' },
			{ nom: 'Bernard', prenom: 'Hugo' },
			{ nom: 'Petit', prenom: 'Anna Lou' }
		]);
	});

	it('sans majuscules : dernier mot = prénom', () => {
		expect(analyserListe('Le Goff Yann')).toEqual([{ nom: 'Le Goff', prenom: 'Yann' }]);
	});

	it('un seul mot = prénom', () => {
		expect(analyserListe('Zoé')).toEqual([{ nom: '', prenom: 'Zoé' }]);
	});
});
