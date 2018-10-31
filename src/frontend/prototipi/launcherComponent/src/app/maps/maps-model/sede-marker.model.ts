import {Sede} from '../../shared/model/sede.model';
import {Coordinate} from '../../shared/model/coordinate.model';

export class SedeMarker implements Sede {
    constructor(
        /**
         * Codice sede
         */
        public codice: string,
        /**
         * Descrizione della sede
         */
        public descrizione: string,
        /**
         * coordinate sede
         */
        public coordinate: Coordinate,
        /**
         * indirizzo sede
         */
        public indirizzo: string,
        /**
         * tipologia sede (Es: Comando, Distaccamento)
         */
        public tipo: string,
        /**
         * label (da decidere)
         */
        public label?: string,
        /**
         * icona della sede
         */
        public icona?: string,
        /**
         * Determina se il marcatore è opaco o meno
         */
        public opacita?: boolean
    ) {
    }

    // getCoordinate() {
    //     return new Coordinate(this.coordinate.latitudine, this.coordinate.longitudine);
    // }
}
