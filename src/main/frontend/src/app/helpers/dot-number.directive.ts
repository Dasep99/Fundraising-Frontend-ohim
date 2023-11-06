import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDotNumber]'
})
export class DotNumberDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9,]/g, '');
    input.value = input.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

}
