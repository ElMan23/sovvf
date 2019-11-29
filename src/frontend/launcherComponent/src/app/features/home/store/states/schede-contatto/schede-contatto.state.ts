import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import {
    SetListaSchedeContatto,
    SetSchedaContattoTelefonata,
    ClearSchedaContattoTelefonata,
    SetSchedaContattoHover,
    ClearSchedaContattoHover,
    SetSchedaContattoLetta,
    SetSchedaContattoGestita,
    GetListaSchedeContatto,
    SetFiltroKeySchedeContatto,
    SetFiltroLettaSchedeContatto,
    ResetFiltriSelezionatiSchedeContatto, SetFiltroSelezionatoSchedaContatto,
    SetFiltroGestitaSchedeContatto, ClearFiltriSchedeContatto, ReducerSetFiltroSchedeContatto, SetContatoriSchedeContatto, UpdateSchedaContatto, ClearListaSchedeContatto
} from '../../actions/schede-contatto/schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../../../shared/enum/classificazione-scheda-contatto.enum';
import { SchedeContattoService } from '../../../../../core/service/schede-contatto/schede-contatto.service';
import { FiltriSchedeContatto } from '../../../../../shared/interface/filtri-schede-contatto.interface';
import { VoceFiltro } from '../../../filterbar/ricerca-group/filtri-richieste/voce-filtro.model';
import { makeCopy } from '../../../../../shared/helper/function';
import {
    resetFiltriSelezionati as _resetFiltriSelezionati,
    setFiltroSelezionato as _setFiltroSelezionato
} from '../../../../../shared/helper/function-filtro';
import { CategoriaFiltriSchedeContatto as Categoria } from '../../../../../shared/enum/categoria-filtri-schede-contatto';
import { ContatoriSchedeContatto } from '../../../../../shared/interface/contatori-schede-contatto.interface';
import { ContatoriSchedeContattoModel } from '../../../../../shared/model/contatori-schede-contatto.model';
import { patch, updateItem } from '@ngxs/store/operators';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

export interface SchedeContattoStateModel {
    contatoriSchedeContatto: ContatoriSchedeContatto;
    schedeContatto: SchedaContatto[];
    schedeContattoCompetenza: SchedaContatto[];
    schedeContattoConoscenza: SchedaContatto[];
    schedeContattoDifferibili: SchedaContatto[];
    schedaContattoTelefonata: SchedaContatto;
    codiceSchedaContattoHover: string;
    filtriSchedeContatto: VoceFiltro[];
    filtriSelezionati: FiltriSchedeContatto;
}

export const SchedeContattoEmpty = {
    schedeContatto: [],
    schedeContattoCompetenza: [],
    schedeContattoConoscenza: [],
    schedeContattoDifferibili: []
};

export const SchedeContattoStateDefaults: SchedeContattoStateModel = {
    contatoriSchedeContatto: new ContatoriSchedeContattoModel(),
    schedeContatto: [],
    schedeContattoCompetenza: [],
    schedeContattoConoscenza: [],
    schedeContattoDifferibili: [],
    schedaContattoTelefonata: null,
    codiceSchedaContattoHover: null,
    filtriSchedeContatto: [
        new VoceFiltro('1', Categoria.Lettura, 'Letta', false),
        new VoceFiltro('2', Categoria.Lettura, 'Non Letta', false),
        new VoceFiltro('3', Categoria.Gestione, 'Gestita', false),
        new VoceFiltro('4', Categoria.Gestione, 'Non Gestita', false)
        // new VoceFiltro('4', Categoria.Appartenenza, 'Personali', false),
        // new VoceFiltro('4', Categoria.Appartenenza, 'Non Personali', false)
    ],
    filtriSelezionati: {
        key: '',
        letta: null,
        gestita: null
    }
};

@State<SchedeContattoStateModel>({
    name: 'schedeContatto',
    defaults: SchedeContattoStateDefaults
})
export class SchedeContattoState {

    @Selector()
    static contatoreSchedeContattoTotale(state: SchedeContattoStateModel) {
        return state.contatoriSchedeContatto.totaleSchede;
    }

    @Selector()
    static contatoriSchedeContatto(state: SchedeContattoStateModel) {
        return state.contatoriSchedeContatto;
    }

    @Selector()
    static schedeContatto(state: SchedeContattoStateModel) {
        return state.schedeContatto;
    }

    @Selector()
    static schedeContattoCompetenza(state: SchedeContattoStateModel) {
        return state.schedeContattoCompetenza;
    }

    @Selector()
    static schedeContattoConoscenza(state: SchedeContattoStateModel) {
        return state.schedeContattoConoscenza;
    }

    @Selector()
    static schedeContattoDifferibili(state: SchedeContattoStateModel) {
        return state.schedeContattoDifferibili;
    }

    @Selector()
    static schedaContattoTelefonata(state: SchedeContattoStateModel) {
        return state.schedaContattoTelefonata;
    }

    @Selector()
    static numeroSchedeContattoCompetenza(state: SchedeContattoStateModel) {
        return state.schedeContattoCompetenza.length;
    }

    @Selector()
    static codiceSchedaContattoHover(state: SchedeContattoStateModel) {
        return state.codiceSchedaContattoHover;
    }

    @Selector()
    static filtriSchedeContatto(state: SchedeContattoStateModel) {
        return state.filtriSchedeContatto;
    }

    @Selector()
    static filtriSelezionati(state: SchedeContattoStateModel) {
        return state.filtriSchedeContatto.filter(f => f.selezionato === true);
    }

    @Selector()
    static ricerca(state: SchedeContattoStateModel) {
        return state.filtriSelezionati.key;
    }

    constructor(private schedeContattoService: SchedeContattoService) {
    }

    @Action(SetContatoriSchedeContatto)
    setContatoriSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetContatoriSchedeContatto) {
        patchState({
            contatoriSchedeContatto: action.contatori
        });
    }

    @Action(GetListaSchedeContatto)
    getListaSchedeContatto({ getState, dispatch }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        this.schedeContattoService.getSchedeContatto(state.filtriSelezionati).subscribe((schedeContatto: SchedaContatto[]) => {
            dispatch(new SetListaSchedeContatto(schedeContatto));
        });
    }

    @Action(SetListaSchedeContatto)
    setListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>, action: SetListaSchedeContatto) {
        patchState({
            schedeContatto: action.schedeContatto,
            schedeContattoCompetenza: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Competenza) : [],
            schedeContattoConoscenza: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Conoscenza) : [],
            schedeContattoDifferibili: action.schedeContatto ? action.schedeContatto.filter(schedaContatto => schedaContatto.classificazione === ClassificazioneSchedaContatto.Differibile) : []
        });
    }

    @Action(ClearListaSchedeContatto)
    clearListaSchedeContatto({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState(SchedeContattoEmpty);
    }

    @Action(UpdateSchedaContatto)
    updateSchedaContatto({ getState, setState, dispatch }: StateContext<SchedeContattoStateModel>, action: UpdateSchedaContatto) {
        const state = getState();
        setState(
            patch({
                schedeContatto: updateItem<SchedaContatto>(s => s.codiceScheda === action.schedaContatto.codiceScheda, action.schedaContatto)
            })
        );
        dispatch(new SetListaSchedeContatto(state.schedeContatto));
    }

    @Action(SetSchedaContattoLetta)
    setSchedaContattoLetta({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoLetta) {
        this.schedeContattoService.setSchedaContattoLetta(action.codiceScheda, action.letta).subscribe(() => {
            console.log('setSchedaContattoLetta api response');
        });
    }

    @Action(SetSchedaContattoGestita)
    setSchedaContattoGestita({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoGestita) {
        this.schedeContattoService.setSchedaContattoGestita(action.codiceScheda, action.gestita).subscribe(() => {
            console.log('setSchedaContattoGestita api response');
        });
    }

    @Action(SetSchedaContattoTelefonata)
    setSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoTelefonata) {
        patchState({
            schedaContattoTelefonata: action.schedaContatto
        });
    }

    @Action(ClearSchedaContattoTelefonata)
    clearSchedaContattoTelefonata({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            schedaContattoTelefonata: null
        });
    }

    @Action(SetSchedaContattoHover)
    setSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>, action: SetSchedaContattoHover) {
        patchState({
            codiceSchedaContattoHover: action.codiceSchedaContatto
        });
    }

    @Action(ClearSchedaContattoHover)
    clearSchedaContattoHover({ patchState }: StateContext<SchedeContattoStateModel>) {
        patchState({
            codiceSchedaContattoHover: null
        });
    }

    @Action(ReducerSetFiltroSchedeContatto)
    reducerSetFiltroSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: ReducerSetFiltroSchedeContatto) {
        const state = getState();
        switch (action.filtro.codice) {
            case '1':
                state.filtriSelezionati.letta === true ? dispatch(new SetFiltroLettaSchedeContatto(null)) : dispatch(new SetFiltroLettaSchedeContatto(true));
                break;
            case '2':
                state.filtriSelezionati.letta === false ? dispatch(new SetFiltroLettaSchedeContatto(null)) : dispatch(new SetFiltroLettaSchedeContatto(false));
                break;
            case '3':
                state.filtriSelezionati.gestita === true ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(true));
                break;
            case '4':
                state.filtriSelezionati.gestita === false ? dispatch(new SetFiltroGestitaSchedeContatto(null)) : dispatch(new SetFiltroGestitaSchedeContatto(false));
                break;
            default:
                console.error('[Errore Switch] ReducerSetFiltroSchedeContatto');
                break;
        }
        dispatch(new SetFiltroSelezionatoSchedaContatto(action.filtro));
    }

    @Action(SetFiltroKeySchedeContatto)
    setFiltroKeySchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroKeySchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                key: action.key,
                letta: state.filtriSelezionati.letta,
                gestita: state.filtriSelezionati.gestita
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SetFiltroLettaSchedeContatto)
    setFiltroLettaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroLettaSchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                key: state.filtriSelezionati.key,
                letta: action.letta,
                gestita: state.filtriSelezionati.gestita
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(SetFiltroGestitaSchedeContatto)
    setFiltroGestitaSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>, action: SetFiltroGestitaSchedeContatto) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                key: state.filtriSelezionati.key,
                letta: state.filtriSelezionati.letta,
                gestita: action.gestita
            }
        });
        dispatch(new GetListaSchedeContatto());
    }

    @Action(ClearFiltriSchedeContatto)
    clearFiltriSchedeContatto({ getState, patchState, dispatch }: StateContext<SchedeContattoStateModel>) {
        const state = getState();
        patchState({
            filtriSelezionati: {
                key: state.filtriSelezionati.key,
                letta: null,
                gestita: null
            }
        });
        dispatch([new GetListaSchedeContatto(), new ResetFiltriSelezionatiSchedeContatto()]);
    }

    // SET FILTRO SELEZIONATO (SELEZIONATO, NON-SELEZIONATO)
    @Action(SetFiltroSelezionatoSchedaContatto)
    setFiltroSelezionato({ getState, patchState }: StateContext<SchedeContattoStateModel>, action: SetFiltroSelezionatoSchedaContatto) {
        const state = getState();

        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);
        const filtro = makeCopy(action.filtro);

        patchState({
            ...state,
            filtriSchedeContatto: _setFiltroSelezionato(filtriSchedeContatto, filtro)
        });
    }

    // RESET FILTRI SELEZIONATI
    @Action(ResetFiltriSelezionatiSchedeContatto)
    resetFiltriSelezionati({ getState, patchState }: StateContext<SchedeContattoStateModel>) {
        const state = getState();

        const filtriSchedeContatto = makeCopy(state.filtriSchedeContatto);

        patchState({
            ...state,
            filtriSchedeContatto: _resetFiltriSelezionati(filtriSchedeContatto)
        });
    }
}
