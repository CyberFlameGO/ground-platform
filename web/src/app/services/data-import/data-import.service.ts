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

import {environment} from 'environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';

const IMPORT_CSV_URL = `${environment.cloudFunctionsUrl}/importCsv`;

const IMPORT_GEOJSON_URL = `${environment.cloudFunctionsUrl}/importGeoJson`;

export interface ImportResult {
  message?: string;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataImportService {
  constructor(private httpClient: HttpClient) {}

  importLocationsOfInterest(
    surveyId: string,
    jobId: string,
    file: File
  ): Promise<ImportResult> {
    const formData = new FormData();
    formData.set('survey', surveyId);
    formData.set('job', jobId);
    formData.append('file', file);
    let importUrl;
    if (file.name.endsWith('.geojson')) {
      importUrl = IMPORT_GEOJSON_URL;
    } else if (file.name.endsWith('.csv')) {
      importUrl = IMPORT_CSV_URL;
    } else {
      throw new Error('Invalid file format');
    }
    return firstValueFrom(
      this.httpClient.post<ImportResult>(importUrl, formData)
    );
  }
}
