import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) return "nol";

    const units = ["", "ribu", "juta", "miliar", "triliun"];
    const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];

    function convertGroup(group: number): string {
      let result = "";
      const hundreds = Math.floor(group / 100);
      const remainder = group % 100;

      if (hundreds > 0) {
        result += words[hundreds] + " ratus ";
      }

      if (remainder > 0) {
        if (remainder < 10) {
          result += words[remainder];
        } else if (remainder < 20) {
          result += words[remainder % 10] + " belas";
        } else {
          result += words[Math.floor(remainder / 10)] + " puluh " + words[remainder % 10];
        }
      }

      return result;
    }

    const groups = [];
    while (value > 0) {
      groups.push(value % 1000);
      value = Math.floor(value / 1000);
    }

    let result = "";
    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      if (group > 0) {
        result += convertGroup(group) + " " + units[i] + " ";
      }
    }

    return result.trim() + " rupiah";
  }

}
