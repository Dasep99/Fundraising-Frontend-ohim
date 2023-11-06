import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appNumber]'
})
export class NumberDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

}
