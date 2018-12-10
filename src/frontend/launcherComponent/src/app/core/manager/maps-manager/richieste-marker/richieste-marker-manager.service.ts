import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { DispatcherRichiesteMarkerService } from '../../../dispatcher/dispatcher-maps/richieste-marker/dispatcher-richieste-marker.service';
import { RichiestaMarker } from '../../../../maps/maps-model/richiesta-marker.model';


@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerManagerService {
    private newRichiesteMarkersList$ = new Subject<RichiestaMarker[]>();
    richiesteMarker: RichiestaMarker[];

    private _count: number;

    set count(count: number) {
        this._count = count;
    }

    get count(): number {
        return this._count;
    }

    constructor(private dispatcher: DispatcherRichiesteMarkerService) {
    }

    getRichiesteMarker() {
        this.newRichiesteMarkersList$.next();
        this.dispatcher.onNewRichiesteMarkersList()
            .subscribe({
                next: data => {
                    this.richiesteMarker = data;
                    this.newRichiesteMarkersList$.next(this.richiesteMarker);
                },
                error: data => console.log(`Errore: + ${data}`)
            });
        return this.newRichiesteMarkersList$.asObservable();
    }

    getMarkerFromId(id) {
        return this.richiesteMarker.find(x => x.id === id);
    }

    /**
     * metodo che opacizza i marker
     * @param action
     * @param filterState
     * @param stringSearch
     */
    cambiaOpacitaMarker(action: boolean, filterState?: string[], stringSearch?: string[]) {
        if (action) {
            /**
             * annullo la precedente ricerca e ritorno null tutte le opacità
             */
            this.richiesteMarker.forEach(r => {
                r.opacita = null;
            });
            if (!filterState) {
                /**
                 * opacizzo i marker con id diverso a quelli della ricerca
                 */
                this.richiesteMarker.forEach(r => {
                    stringSearch.forEach(c => {
                        if (r.id === c) {
                            r.opacita = false;
                        } else if (r.opacita !== false) {
                            r.opacita = true;
                        }
                    });
                });
            } else {
                /**
                 * opacizzo i marker con stato diverso da quello di filterState
                 */
                this.richiesteMarker.forEach(r => {
                    filterState.forEach(c => {
                        if (r.stato.substring(0, 5) === c.substring(0, 5)) {
                            r.opacita = false;
                        } else if (r.opacita !== false) {
                            r.opacita = true;
                        }
                    });
                });
            }
        } else {
            /**
             * ritorno null a tutti i marker e tolgo l'opacità
             */
            this.richiesteMarker.forEach(r => {
                r.opacita = null;
            });
        }
    }

}
