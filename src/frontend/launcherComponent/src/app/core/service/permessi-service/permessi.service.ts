import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PermessiState } from '../../../shared/store/states/permessi/permessi.state';
import { Observable } from 'rxjs';
import { PermessiFeatureInterface } from '../../../shared/interface/permessi-feature.interface';
import { Ruolo } from '../../../shared/model/utente.model';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { RuoliUtenteLoggatoState } from '../../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';

@Injectable({
    providedIn: 'root'
})
export class PermessiService {

    @Select(RuoliUtenteLoggatoState.ruoli) ruoli$: Observable<Ruolo[]>;
    ruoli: Ruolo[];

    permessi: PermessiFeatureInterface[];

    constructor(private store: Store) {
        this.getRuoliUtenteLoggato();
        this.getPermessi();
    }

    getPermessi(): void {
        this.permessi = this.store.selectSnapshot(PermessiState.permessi);
    }

    getRuoliUtenteLoggato(): void {
        this.ruoli$.subscribe((ruoli: Ruolo[]) => {
            this.ruoli = ruoli;
        });
    }

    checkUserPermissionByFeature(feature: PermissionFeatures): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (this.ruoli && this.ruoli && this.ruoli.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli.forEach((ruolo: Ruolo) => {
                if (permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
            let index: number;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index ? index : null;
        }
    }

    checkUserPermissionRichiesta(feature: PermissionFeatures, codUOCompetenza: string[], codSOCompetente: string): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (this.ruoli && this.ruoli && this.ruoli.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli.forEach((ruolo: Ruolo) => {
                if (checkSede(ruolo, codUOCompetenza, codSOCompetente) && permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
            let index: number;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index ? index : null;
        }

        function checkSede(ruolo, codUOCompetenzaRef, codSOCompetenteRef): boolean {
            let count = 0;
            if (codUOCompetenzaRef) {
                codUOCompetenzaRef.forEach((codUo) => {
                    if (ruolo.codSede === codUo) {
                        count++;
                    }
                });
            }
            if (count === 0 && ruolo.codSede === codSOCompetenteRef) {
                count++;
            }
            return count > 0;
        }
    }

    checkUserPermissionSchedaContatto(feature: PermissionFeatures, codSede: string): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (this.ruoli && this.ruoli && this.ruoli.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli.forEach((ruolo: Ruolo) => {
                if (ruolo.codSede === codSede && permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
            let index: number;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index ? index : null;
        }
    }
}
