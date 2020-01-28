import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { B2BUnitNode } from '../../../model/org-unit.model';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { OrgUnitConnector } from '../../connectors/org-unit/org-unit.connector';
import { OrgUnitActions } from '../actions/index';
import { EntitiesModel } from '../../../model/misc.model';
import { normalizeListPage } from '../../utils/serializer';

@Injectable()
export class OrgUnitEffects {
  @Effect()
  loadOrgUnit$: Observable<
    OrgUnitActions.LoadOrgUnitSuccess | OrgUnitActions.LoadOrgUnitFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_ORG_UNIT),
    map((action: OrgUnitActions.LoadOrgUnit) => action.payload),
    switchMap(({ userId, orgUnitId }) => {
      return this.orgUnitConnector.get(userId, orgUnitId).pipe(
        map((orgUnit: B2BUnitNode) => {
          return new OrgUnitActions.LoadOrgUnitSuccess([orgUnit]);
        }),
        catchError(error =>
          of(
            new OrgUnitActions.LoadOrgUnitFail({
              orgUnitId,
              error: makeErrorSerializable(error),
            })
          )
        )
      );
    })
  );

  @Effect()
  loadOrgUnits$: Observable<
    | OrgUnitActions.LoadOrgUnitSuccess
    | OrgUnitActions.LoadOrgUnitsSuccess
    | OrgUnitActions.LoadOrgUnitsFail
  > = this.actions$.pipe(
    ofType(OrgUnitActions.LOAD_ORG_UNITS),
    map((action: OrgUnitActions.LoadOrgUnits) => action.payload),
    switchMap(payload =>
      this.orgUnitConnector.getList(payload.userId).pipe(
        switchMap((orgUnitsList: EntitiesModel<B2BUnitNode>) => {
          const { values, page } = normalizeListPage(orgUnitsList, 'id');
          return [
            new OrgUnitActions.LoadOrgUnitSuccess(values),
            new OrgUnitActions.LoadOrgUnitsSuccess({
              page,
            }),
          ];
        }),
        catchError(error =>
          of(
            new OrgUnitActions.LoadOrgUnitsFail({
              error: makeErrorSerializable(error),
            })
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private orgUnitConnector: OrgUnitConnector
  ) {}
}
