/**
 * Copyright 2023 Google LLC
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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSurveyComponent} from 'app/pages/create-survey/create-survey.component';
import {JobDetailsModule} from './job-details/job-details.module';
import {SurveyDetailsModule} from './survey-details/survey-details.module';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [CreateSurveyComponent],
  imports: [
    JobDetailsModule,
    SurveyDetailsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [CreateSurveyComponent],
})
export class CreateSurveyModule {}
