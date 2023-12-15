import { Component } from '@angular/core';
import localeID from '@angular/common/locales/id';
import {registerLocaleData} from "@angular/common";
import 'jquery';
import 'select2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fundraising';

  constructor() {
    registerLocaleData(localeID);
  }
}
