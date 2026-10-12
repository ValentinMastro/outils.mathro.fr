// Glisser-déposer HTML5 : on transporte simplement l'id de l'élève.
const TYPE = 'application/x-eleve';

export function commencerGlisser(e: DragEvent, eleveId: string) {
	if (!e.dataTransfer) return;
	e.dataTransfer.setData(TYPE, eleveId);
	e.dataTransfer.effectAllowed = 'move';
}

/** À appeler sur dragenter et dragover : autorise le dépôt si un élève est transporté. */
export function accepterGlisser(e: DragEvent): boolean {
	if (!e.dataTransfer?.types.includes(TYPE)) return false;
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';
	return true;
}

export function eleveDepose(e: DragEvent): string | null {
	e.preventDefault();
	return e.dataTransfer?.getData(TYPE) || null;
}
