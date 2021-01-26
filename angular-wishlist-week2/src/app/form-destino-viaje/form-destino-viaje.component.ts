import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap  } from 'rxjs/operators';
import { ajax  } from 'rxjs/ajax';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  nombreMinLongitud = 5;
  searchResults: string[];

  constructor(fb: FormBuilder) {
    this.onItemAdded= new EventEmitter();
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.validadorCustom,
        this.validadorCustomParametrizable(this.nombreMinLongitud)
      ])],
      url: ['']
    }
    );

    this.fg.valueChanges.subscribe( (form: any) => {
      console.log("cambio el form", form);
    }
    );
  }

  ngOnInit(): void {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre, 'input') //genera observable de eventos de entrada
      .pipe( //flujo de operaciones
        map( (e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(text => text.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap( () => ajax('/assets/datos.json') ) //consulta asincrona, de un json fijo
        ).subscribe(
          ajaxResponse => {
            this.searchResults=ajaxResponse.response;
          }
        )
  }

  guardar(nombre:string, url:string): boolean{
    let d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  validadorCustom(control: FormControl): { [s: string]: boolean } {
    const len = control.value.toString().trim().length;
    if (len >0 && len < 3){
      return { 'nombreFormatoInvalido': true}
    }
    return null; //Ok
  }

  validadorCustomParametrizable(minLong: number): ValidatorFn{
    return (control: FormControl): { [s: string]: boolean } | null => {
      const len = control.value.toString().trim().length;
      if (len >0 && len < minLong){
        return { 'nombreValidarLongitud': true}
      }

      return null;
    }
  }
}
