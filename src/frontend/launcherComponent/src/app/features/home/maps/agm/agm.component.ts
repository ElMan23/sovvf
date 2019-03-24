import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { RichiestaMarker } from '../maps-model/richiesta-marker.model';
import { SedeMarker } from '../maps-model/sede-marker.model';
import { MezzoMarker } from '../maps-model/mezzo-marker.model';
import { ChiamataMarker } from '../maps-model/chiamata-marker.model';
import { Meteo } from '../../../../shared/model/meteo.model';
import { CentroMappa } from '../maps-model/centro-mappa.model';
import { MarkerService } from '../service/marker-service/marker-service.service';
import { Observable, Subscription } from 'rxjs';
import { AgmService } from './agm-service.service';
import { ControlPosition, FullscreenControlOptions, ZoomControlOptions } from '@agm/core/services/google-maps-types';
import { MeteoMarker } from '../maps-model/meteo-marker.model';
import { DirectionInterface } from '../maps-interface/direction-interface';
import { CachedMarker } from '../maps-model/cached-marker.model';
import { ViewInterfaceMaps } from '../../../../shared/interface/view.interface';
import { ComposizioneMarker } from '../maps-model/composizione-marker.model';
import { Select } from '@ngxs/store';
import { MeteoMarkersState } from '../../store/states/maps/meteo-markers.state';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { MouseE } from '../../../../shared/enum/mouse-e.enum';
import { MapsDirectionState } from '../../store/states/maps/maps-direction.state';
import { markerColor } from '../../../../shared/helper/function-colori';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { wipeStatoRichiesta } from '../../../../shared/helper/function';

declare var google: any;


@Component({
    selector: 'app-agm',
    templateUrl: './agm.component.html',
    styleUrls: ['./agm.component.css']
})

export class AgmComponent implements OnDestroy {
    @Input() richiesteMarkers: RichiestaMarker[];
    @Input() sediMarkers: SedeMarker[];
    @Input() mezziMarkers: MezzoMarker[];
    @Input() centroMappa: CentroMappa;
    @Input() chiamataMarkers: ChiamataMarker[];
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() composizioneMarkers: ComposizioneMarker[];
    @Output() mapFullyLoaded = new EventEmitter<boolean>();
    cachedMarkers: CachedMarker[] = [];
    AppFeatures = AppFeatures;
    MouseE = MouseE;

    @Select(MeteoMarkersState.meteoMarkers) meteoMarkers$: Observable<MeteoMarker[]>;
    meteoMarkers: MeteoMarker[] = [];

    minMarkerCluster: number;
    map_loaded = false;
    subscription = new Subscription();
    map: any;
    richiestaMarkerIconUrl: string;
    meteoMarkerIconUrl: string;

    zoomControlOptions: ZoomControlOptions = {
        position: ControlPosition.BOTTOM_RIGHT
    };

    fullscreenControlOptions: FullscreenControlOptions = {
        position: ControlPosition.TOP_LEFT
    };

    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;
    direction: DirectionInterface = {
        isVisible: false
    };

    renderOptions: any = {
        draggable: false,
        suppressMarkers: true,
        suppressInfoWindows: true
    };


    @ViewChild('agmContainer') agmContainer: ElementRef;

    constructor(private markerService: MarkerService,
                private agmService: AgmService) {
        /**
         * creo un array di marker fittizi con tutte le icone che utilizzerà agm per metterle in cache
         * ed evitare che si presenti il bug delle icone "selezionate"
         */
        this.markerService.iconeCached.forEach(iconeC => {
            this.cachedMarkers.push(new CachedMarker(iconeC));
        });
        /**
         * marker di tipo meteo
         * @type {Subscription}
         */
        this.subscription.add(this.meteoMarkers$.subscribe((marker: MeteoMarker[]) => {
            this.meteoMarkers = marker;
        }));
        /**
         * direzioni di tipo direction
         * @type {Subscription}
         */
        this.subscription.add(
            this.direction$.subscribe((direzioni: DirectionInterface) => {
                this.direction = direzioni;
            })
        );
        /**
         * marker minimi per creare un cluster
         * @type {number}
         */
        this.minMarkerCluster = this.markerService.minMarkerCluster;
        /**
         * imposto il path per le icone di MeteoMarker e ChiamataMarker
         */
        this.richiestaMarkerIconUrl = this.markerService.iconaSpeciale('chiamata');
        this.meteoMarkerIconUrl = this.markerService.iconaSpeciale('meteo');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    mappaCaricata(event: any): void {
        /**
         *  imposto una proprietà a true quando la mappa è caricata e inserisco nell'oggetto map il menù
         */
        const self = this;
        this.map_loaded = true;
        this.map = event;
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('Settings'));
        google.maps.event.addListenerOnce(this.map, 'tilesloaded', function () {
            self.cachedMarkers = [];
            self.mapFullyLoaded.emit(true);
        });
    }

    loadAPIWrapper(mapWrapper: any): void {
        /**
         * importo il wrapper nell'oggetto map
         */
        this.agmService.map = mapWrapper;
    }

    getCoordinateMarker(event: any) {
        this.markerService.createMeteoMarker(event);
    }

    zIndex(id: string, tipoMarker: string): number {
        return this.markerService.zIndex(id, tipoMarker);
    }

    isClicked(id: string, tipoMarker: string): boolean {
        return this.markerService.isClicked(id, tipoMarker);
    }

    isHovered(id: string, tipoMarker: string): boolean {
        return this.markerService.isHovered(id, tipoMarker);
    }

    isVisible(tipoMarker: string): boolean {
        return this.markerService.isVisible(tipoMarker);
    }

    isOpaque(id: string, tipoMarker: string): number {
        /**
         * richiedo al service che gestisce i marker sulla mappa, di ritornarmi se il marker è opacizzato
         */
        return this.markerService.isOpaque(id, tipoMarker);
    }

    centroCambiato(centro: any): void {
        /**
         * metodo che fa la next sulla subject di centro
         */
        this.agmService.centro$.next(centro);
    }

    mappaCliccata(): void {
        /**
         * metodo che ritorna allo zoom iniziale e deseleziona un marker se clicco sulla mappa
         */
        this.markerService.noAction();
    }

    iconaRichiestaMarker(richiestaMarker: RichiestaMarker): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaRichiestaMarker(richiestaMarker.id, richiestaMarker.stato, richiestaMarker.priorita);
    }

    iconaMezzoMarker(mezzoMarker: MezzoMarker): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaMezzoMarker(mezzoMarker.mezzo.codice, mezzoMarker.mezzo.stato);
    }

    iconaSedeMarker(sedeMarker: SedeMarker): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaSedeMarker(sedeMarker.codice, sedeMarker.tipo);
    }

    iconaSedeTipoWindow(tipo: string): string {
        /**
         * ritorno l'url dell'icona del marker selezionato
         */
        return this.markerService.iconaSedeTipoWindow(tipo);
    }

    actionRichiestaMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionRichiestaMarker(id, event);
    }

    actionMezzoMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionMezzoMarker(id, event);
    }

    actionSedeMarker(id: string, event: MouseE): void {
        /**
         * scateno l'azione relativa all'evento del mouse ricevuto
         */
        this.markerService.actionSedeMarker(id, event);
    }

    findDatiMeteo(_id: string): Meteo {
        /**
         * ritorno i dati meteo del marker selezionato
         */
        return this.markerService.findDatiMeteo(_id);
    }

    colorWindow(stato: string): string {
        return markerColor(stato);
    }

    wipeStatoRichiesta(statoEnum: StatoRichiesta): string {
        return wipeStatoRichiesta(statoEnum);
    }

}
