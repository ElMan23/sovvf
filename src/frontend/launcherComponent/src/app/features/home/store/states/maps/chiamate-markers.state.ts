import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { append, insertItem, patch, removeItem } from '@ngxs/store/operators';
import { ChiamataMarker } from '../../../maps/maps-model/chiamata-marker.model';
import {
    InsertChiamateMarkers, ClearChiamateMarkers,
    GetChiamateMarkers,
    InsertChiamataMarker,
    RemoveChiamataMarker,
    SetChiamataMarker, DelChiamataMarker
} from '../../actions/maps/chiamate-markers.actions';
import { ChiamateMarkerService } from '../../../../../core/service/maps-service';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { SchedaTelefonataState } from '../chiamata/scheda-telefonata.state';
import { ViewComponentState } from '../view/view.state';

export interface ChiamateMarkersStateModel {
    chiamateMarkers: ChiamataMarker[];
}

export const ChiamateMarkersStateDefaults: ChiamateMarkersStateModel = {
    chiamateMarkers: null,
};

@State<ChiamateMarkersStateModel>({
    name: 'chiamateMarkers',
    defaults: ChiamateMarkersStateDefaults
})

export class ChiamateMarkersState {

    @Selector()
    static chiamateMarkers(state: ChiamateMarkersStateModel) {
        return state.chiamateMarkers;
    }

    constructor(private chiamateMarkerService: ChiamateMarkerService, private store: Store) {
    }

    @Action(GetChiamateMarkers)
    getChiamateMarkers({ dispatch }: StateContext<ChiamateMarkersStateModel>) {
        this.chiamateMarkerService.getChiamateMarkers().subscribe(() => {
            // dispatch(new SetChiamateMarkers(result));
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Reperimento delle chiamate fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(SetChiamataMarker)
    setChiamataMarker({ dispatch }: StateContext<ChiamateMarkersStateModel>, action: SetChiamataMarker) {
        this.chiamateMarkerService.setChiamataInCorso(action.chiamataMarker).subscribe(() => {
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Inserimento della chiamata in corso fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(DelChiamataMarker)
    delChiamataMarker({ getState, dispatch }: StateContext<ChiamateMarkersStateModel>, action: DelChiamataMarker) {
        const state = getState();
        const marker = state.chiamateMarkers.find(chiamataMarker => chiamataMarker.id === action.id);

        this.chiamateMarkerService.deleteChiamataInCorso(marker).subscribe(() => {
        }, error => {
            console.error(error);
            dispatch(new ShowToastr(ToastrType.Error, 'Cancellazione della chiamata in corso fallito', 'Si è verificato un errore, riprova.', 5));
        });
    }

    @Action(InsertChiamateMarkers)
    insertChiamateMarkers({ setState }: StateContext<ChiamateMarkersStateModel>, { chiamateMarkers }: InsertChiamateMarkers) {
        setState(
            patch({
                chiamateMarkers: append(chiamateMarkers)
            })
        );
    }

    @Action(InsertChiamataMarker)
    insertChiamataMarker({ setState, dispatch }: StateContext<ChiamateMarkersStateModel>, { chiamataMarker }: InsertChiamataMarker) {
        const mySelf = this.store.selectSnapshot(SchedaTelefonataState.myChiamataMarker);
        const viewComponent = this.store.selectSnapshot(ViewComponentState.viewComponent);
        if (viewComponent.chiamata.active) {
            if (mySelf) {
                chiamataMarker.mySelf = mySelf === chiamataMarker.id;
            }
            setState(
                patch({
                    chiamateMarkers: insertItem(chiamataMarker)
                })
            );
        }
    }

    @Action(RemoveChiamataMarker)
    removeChiamataMarker({ setState }: StateContext<ChiamateMarkersStateModel>, { id }: RemoveChiamataMarker) {
        const viewComponent = this.store.selectSnapshot(ViewComponentState.viewComponent);
        // if (viewComponent.chiamata) {
            console.log(id);
            setState(
                patch({
                    chiamateMarkers: removeItem<ChiamataMarker>(chiamata => chiamata.id === id)
                })
            );
        // }
    }

    @Action(ClearChiamateMarkers)
    clearChiamateMarkers({ patchState }: StateContext<ChiamateMarkersStateModel>) {
        patchState(ChiamateMarkersStateDefaults);
    }

}
