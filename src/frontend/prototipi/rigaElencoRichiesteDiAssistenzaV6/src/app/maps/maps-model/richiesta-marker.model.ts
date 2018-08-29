import {Marker} from './marker.model';
import {DescrizioneLocalita} from '../../shared/model/descrizione-localita.model';

export class RichiestaMarker implements Marker {
    constructor(
        /* id */
        public id_richiesta: number,
        /* La stringa dell'indirizzo e le relative coordinate */
        public localita: DescrizioneLocalita,
        /* Id del tipo tipologia */
        public id_tipologia: number,
        /* Contiene la descrizione della label da mostrare */
        public label: string,
        /* Determina la rilevanza del marcatore */
        public rilevante: boolean
    ) {
    }
}
