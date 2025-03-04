/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {DataStoreService} from 'app/services/data-store/data-store.service';
import {
  of,
  Observable,
  ReplaySubject,
  Subscription,
  BehaviorSubject,
} from 'rxjs';
import {LocationOfInterest} from 'app/models/loi.model';
import {Survey} from 'app/models/survey.model';
import {Injectable} from '@angular/core';
import {Submission} from 'app/models/submission/submission.model';
import {List, Map} from 'immutable';
import {switchMap} from 'rxjs/operators';
import {SurveyService} from 'app/services/survey/survey.service';
import {LocationOfInterestService} from 'app/services/loi/loi.service';
import {LoadingState} from 'app/services/loading-state.model';
import {AuditInfo} from 'app/models/audit-info.model';
import {AuthService} from 'app/services/auth/auth.service';
import {User} from 'app/models/user.model';
import {Result} from 'app/models/submission/result.model';
import {NavigationService} from 'app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  // TODO: Move selected submission into side panel component where it is
  // used.
  private selectedSubmissionId$ = new ReplaySubject<string>(1);
  private selectedSubmission$ = new BehaviorSubject<Submission | LoadingState>(
    LoadingState.NOT_LOADED
  );
  private subscription = new Subscription();

  constructor(
    private dataStore: DataStoreService,
    surveyService: SurveyService,
    loiService: LocationOfInterestService,
    authService: AuthService
  ) {
    this.subscription.add(
      this.selectedSubmissionId$
        .pipe(
          switchMap(submissionId =>
            surveyService.getActiveSurvey$().pipe(
              switchMap(survey =>
                loiService.getSelectedLocationOfInterest$().pipe(
                  switchMap(loi =>
                    authService.getUser$().pipe(
                      switchMap(user => {
                        if (
                          submissionId === NavigationService.SUBMISSION_ID_NEW
                        ) {
                          return of(
                            this.createNewSubmission(user, survey, loi)
                          );
                        }
                        return this.dataStore.loadSubmission$(
                          survey,
                          loi,
                          submissionId
                        );
                      })
                    )
                  )
                )
              )
            )
          )
        )
        .subscribe(o => this.selectedSubmission$.next(o))
    );
  }

  createNewSubmission(
    user: User,
    survey: Survey,
    loi: LocationOfInterest
  ): Submission | LoadingState {
    if (!user) {
      throw Error('Login required to create new submission.');
    }
    const job = survey.getJob(loi.jobId);
    if (!job) {
      throw Error(`Missing job ${loi.jobId}`);
    }
    const newSubmissionId = this.dataStore.generateId();
    const auditInfo = new AuditInfo(
      user,
      new Date(),
      this.dataStore.getServerTimestamp()
    );
    return new Submission(
      newSubmissionId,
      loi.id,
      job,
      auditInfo,
      auditInfo,
      Map<string, Result>([])
    );
  }

  submissions$(
    survey: Survey,
    loi: LocationOfInterest
  ): Observable<List<Submission>> {
    return this.dataStore.submissions$(survey, loi);
  }

  selectSubmission(submissionId: string) {
    this.selectedSubmission$.next(LoadingState.LOADING);
    this.selectedSubmissionId$.next(submissionId);
  }

  deselectSubmission() {
    this.selectedSubmission$.next(LoadingState.NOT_LOADED);
  }

  getSelectedSubmission$(): BehaviorSubject<Submission | LoadingState> {
    return this.selectedSubmission$;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
