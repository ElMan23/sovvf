import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import {
    AddFiltroSelezionatoComposizione, ClearPartenza, ConfirmPartenze,
    GetFiltriComposizione,
    RemoveFiltriSelezionatiComposizione,
    RemoveFiltroSelezionatoComposizione, RichiestaComposizione, SetComposizioneMode,
    SetFiltriComposizione, TerminaComposizione,
    ToggleComposizioneMode,
    UpdateListe, UpdateRichiestaComposizione, SetListaFiltriAffini
} from '../../actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaStateModel } from './composizione-partenza.state';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ComposizioneMarker } from '../../../maps/maps-model/composizione-marker.model';
import {
    ClearComposizioneVeloce,
    ClearPreaccoppiati, ClearPreAccoppiatiSelezionatiComposizione,
    GetListaIdPreAccoppiati
} from '../../actions/composizione-partenza/composizione-veloce.actions';
import { Composizione } from '../../../../../shared/enum/composizione.enum';
import {
    ClearComposizioneAvanzata,
    GetListeComposizioneAvanzata,
    UnselectMezziAndSquadreComposizioneAvanzata
} from '../../actions/composizione-partenza/composizione-avanzata.actions';
import {
    ClearListaMezziComposizione,
    ClearMezzoComposizione
} from '../../actions/composizione-partenza/mezzi-composizione.actions';
import {
    ClearListaSquadreComposizione,
    ClearSquadraComposizione
} from '../../actions/composizione-partenza/squadre-composizione.actions';
import { CompPartenzaService } from '../../../../../core/service/comp-partenza-service/comp-partenza.service';
import { AddInLavorazione, DeleteInLavorazione } from '../../actions/richieste/richiesta-attivita-utente.actions';
import { ClearDirection } from '../../actions/maps/maps-direction.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ClearMarkerMezzoSelezionato, ClearMarkerState } from '../../actions/maps/marker.actions';
import { ListaTipologicheMezzi } from '../../../composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { ComposizioneFilterbar } from '../../../composizione-partenza/interface/composizione/composizione-filterbar-interface';
import { ListaComposizioneAvanzata } from '../../../composizione-partenza/interface/lista-composizione-avanzata-interface';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { DescrizioneTipologicaMezzo } from '../../../composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';

export interface ComposizionePartenzaStateModel {
    filtriAffini: ListaTipologicheMezzi;
    codiceDistaccamento: any[];
    codiceTipoMezzo: any[];
    codiceStatoMezzo: any[];
    richiesta: SintesiRichiesta;
    composizioneMode: Composizione;
}

export const ComposizioneStateDefaults: ComposizionePartenzaStateModel = {
    filtriAffini: {
        distaccamenti: [],
        generiMezzi: [],
        stati: []
    },
    codiceDistaccamento: [],
    codiceTipoMezzo: [],
    codiceStatoMezzo: [],
    richiesta: null,
    composizioneMode: Composizione.Avanzata
};


@State<ComposizionePartenzaStateModel>({
    name: 'composizionePartenza',
    defaults: ComposizioneStateDefaults
})

export class ComposizionePartenzaState {

    @Selector()
    static filtriAffini(state: ComposizionePartenzaStateModel) {
        return state.filtriAffini;
    }

    @Selector()
    static filtriSelezionati(state: ComposizionePartenzaStateModel): ComposizioneFilterbar {
        return {
            CodiceDistaccamento: state.codiceDistaccamento,
            CodiceTipoMezzo: state.codiceTipoMezzo,
            CodiceStatoMezzo: state.codiceStatoMezzo
        };
    }

    @Selector()
    static richiestaComposizione(state: ComposizionePartenzaStateModel): SintesiRichiesta {
        return state.richiesta;
    }

    @Selector()
    static richiestaComposizioneMarker(state: ComposizionePartenzaStateModel): ComposizioneMarker[] {
        let composizioneMarkers: ComposizioneMarker[] = [];
        if (state.richiesta !== ComposizioneStateDefaults.richiesta) {
            const composizioneMarker = new ComposizioneMarker(
                state.richiesta.id, state.richiesta.localita, state.richiesta.tipologie, null,
                state.richiesta.prioritaRichiesta, state.richiesta.stato, true, false);
            composizioneMarkers.push(composizioneMarker);
        } else {
            composizioneMarkers = [];
        }
        return composizioneMarkers;
    }

    constructor(private store: Store,
        private compPartenzaService: CompPartenzaService) {
    }

    @Action(GetFiltriComposizione)
    getFiltriComposizione({ dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        dispatch(new SetFiltriComposizione(filtri));
    }

    @Action(SetFiltriComposizione)
    setFiltriComposizione({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: SetFiltriComposizione) {
        console.log('setFiltriComposizione', action);
        const state = getState();
        const composizioneMode = state.composizioneMode;
        const objFiltriSelezionati: ComposizioneFilterbar = {
            CodiceDistaccamento: state.codiceDistaccamento,
            CodiceTipoMezzo: state.codiceTipoMezzo,
            CodiceStatoMezzo: state.codiceStatoMezzo
        };
        // console.log('objFiltriSelezionati', objFiltriSelezionati);
        dispatch(new GetListeComposizioneAvanzata(objFiltriSelezionati));
        if (composizioneMode === Composizione.Veloce) {
            dispatch([
                new GetListaIdPreAccoppiati()
            ]);
        }
    }

    @Action(SetListaFiltriAffini)
    setListaFiltriAffini({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        const filtri = this.store.selectSnapshot(state => state.tipologicheMezzi.tipologiche);
        let listaMezziSquadre = {} as ListaComposizioneAvanzata;
        listaMezziSquadre = this.store.selectSnapshot(state => state.composizioneAvanzata.listaMezziSquadre);
        const filtriDistaccamento = [] as DescrizioneTipologicaMezzo[];
        const filtriStato = [] as DescrizioneTipologicaMezzo[];
        const generiMezzi = [] as DescrizioneTipologicaMezzo[];
        if (listaMezziSquadre.composizioneMezzi && listaMezziSquadre.composizioneSquadre) {
            filtri.distaccamenti.forEach((distaccamento: DescrizioneTipologicaMezzo) => {
                if (checkDistaccamento(distaccamento)) {
                    filtriDistaccamento.push(distaccamento);
                }
            });
            filtri.stati.forEach((stato: DescrizioneTipologicaMezzo) => {
                if (checkStato(stato)) {
                    filtriStato.push(stato);
                }
            });
            filtri.generiMezzi.forEach((genereMezzi: DescrizioneTipologicaMezzo) => {
                if (checkGenereMezzo(genereMezzi)) {
                    generiMezzi.push(genereMezzi);
                }
            });
        }

        function checkDistaccamento(distaccamento: DescrizioneTipologicaMezzo) {
            let _return = false;
            listaMezziSquadre.composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.distaccamento.codice === distaccamento.id) {
                    _return = true;
                }
            });
            return _return;
        }
        function checkStato(stato: DescrizioneTipologicaMezzo) {
            let _return = false;
            listaMezziSquadre.composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.stato === stato.descrizione) {
                    _return = true;
                }
            });
            return _return;
        }
        function checkGenereMezzo(genereMezzo: DescrizioneTipologicaMezzo) {
            let _return = false;
            listaMezziSquadre.composizioneMezzi.forEach((mezzoComp: MezzoComposizione) => {
                if (mezzoComp.mezzo.genere === genereMezzo.descrizione) {
                    _return = true;
                }
            });
            return _return;
        }

        patchState({
            filtriAffini: {
                distaccamenti: filtriDistaccamento,
                generiMezzi: generiMezzi,
                stati: filtriStato
            }
        });

        // console.log('filtriDistaccamento', filtriDistaccamento);
        // console.log('filtriStato', filtriStato);
        // console.log('generiMezzi', generiMezzi);
    }

    @Action(UpdateListe)
    updateListe({ dispatch }: StateContext<ComposizionePartenzaStateModel>, action: UpdateListe) {
        dispatch(new GetListeComposizioneAvanzata(action.filtri));
    }

    @Action(AddFiltroSelezionatoComposizione)
    addFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: AddFiltroSelezionatoComposizione) {
        console.log('Filtro selezionato', action.id);
        // const state = ctx.getState();
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: insertItem(action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: insertItem(action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: insertItem(action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltroSelezionatoComposizione)
    removeFiltroSelezionatoComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltroSelezionatoComposizione) {
        console.log('Filtro deselezionato', action.id);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: removeItem(filtro => filtro === action.id)
                    })
                );
                break;
        }
    }

    @Action(RemoveFiltriSelezionatiComposizione)
    removeFiltriSelezionatiComposizione(ctx: StateContext<ComposizionePartenzaStateModel>, action: RemoveFiltriSelezionatiComposizione) {
        console.log('Filtri deselezionati', action.tipo);
        switch (action.tipo) {
            case 'codiceDistaccamento':
                ctx.setState(
                    patch({
                        codiceDistaccamento: []
                    })
                );
                break;
            case 'codiceTipoMezzo':
                ctx.setState(
                    patch({
                        codiceTipoMezzo: []
                    })
                );
                break;
            case 'codiceStatoMezzo':
                ctx.setState(
                    patch({
                        codiceStatoMezzo: []
                    })
                );
                break;
        }
    }

    @Action(RichiestaComposizione)
    richiestaComposizione({ patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: RichiestaComposizione) {
        patchState({
            richiesta: action.richiesta
        });
        dispatch(new AddInLavorazione(action.richiesta));
    }

    @Action(ToggleComposizioneMode)
    toggleComposizioneMode({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        if (state.composizioneMode === Composizione.Avanzata) {
            dispatch(new ClearListaMezziComposizione());
            dispatch(new ClearListaSquadreComposizione());
            dispatch(new UnselectMezziAndSquadreComposizioneAvanzata());
            patchState({
                composizioneMode: Composizione.Veloce
            });
        } else {
            dispatch(new ClearPreaccoppiati());
            patchState({
                composizioneMode: Composizione.Avanzata
            });
        }
    }

    @Action(SetComposizioneMode)
    setComposizioneMode({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: SetComposizioneMode) {
        patchState({
            composizioneMode: action.compMode
        });
    }

    @Action(UpdateRichiestaComposizione)
    updateRichiestaComposizione({ patchState }: StateContext<ComposizionePartenzaStateModel>, action: UpdateRichiestaComposizione) {
        patchState({
            richiesta: action.richiesta
        });
    }

    @Action(ConfirmPartenze)
    confirmPartenze({ getState, patchState, dispatch }: StateContext<ComposizionePartenzaStateModel>, action: ConfirmPartenze) {
        this.compPartenzaService.confermaPartenze(action.partenze).subscribe(() => {
            console.log('Richiesta aggiornata con le partenze', action.partenze);
            dispatch([new ClearMarkerMezzoSelezionato(), new ClearDirection()]);
            const state = getState();
            if (state.composizioneMode === Composizione.Veloce) {
                dispatch(new ClearPreAccoppiatiSelezionatiComposizione());
            }
        }, () => {
            console.error('Conferma Partenza: qualcosa è andato storto');
        });
    }

    @Action(TerminaComposizione)
    terminaComposizione({ getState, dispatch }: StateContext<ComposizionePartenzaStateModel>) {
        const state = getState();
        dispatch([
            new DeleteInLavorazione(state.richiesta),
            new ClearDirection(),
            new GetInitCentroMappa(),
            new ClearComposizioneVeloce(),
            new ClearComposizioneAvanzata(),
            new ClearMezzoComposizione(),
            new ClearSquadraComposizione(),
            new ClearPartenza(),
            new ClearMarkerState(),
        ]);
    }

    @Action(ClearPartenza)
    clearPartenza({ patchState }: StateContext<ComposizionePartenzaStateModel>) {
        patchState(ComposizioneStateDefaults);
    }
}
