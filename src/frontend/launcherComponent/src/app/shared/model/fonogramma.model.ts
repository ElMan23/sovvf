import { StatoFonogramma } from '../enum/stato.fonogramma';

export class Fonogramma {
    constructor(
        public idOperatore: string,
        public idRichiesta: string,
        public numeroFonogramma: string,
        public protocolloFonogramma: string,
        public destinatari: string[],
        public stato: StatoFonogramma
    ) {
    }
}
