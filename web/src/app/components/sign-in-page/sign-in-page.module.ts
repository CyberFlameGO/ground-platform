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

import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {HeaderModule} from 'app/components/header/header.module';
import {FirebaseUIModule} from 'firebaseui-angular';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {NgModule} from '@angular/core';
import {SignInPageComponent} from './sign-in-page.component';

@NgModule({
  declarations: [SignInPageComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FirebaseUIModule,
    HeaderModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  exports: [SignInPageComponent],
})
export class SignInPageModule {}
