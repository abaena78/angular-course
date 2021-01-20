import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  destinos: DestinoViaje[];

  constructor() {
    this.onItemAdded= new EventEmitter();
    this.destinos = []
  }

  ngOnInit(): void {
  }

  //Ya no se va a usar, se reemplaza por agregado
  guardar(nombre:string, url:string):boolean{
    console.log("guardar:"+nombre+","+url)
    this.destinos.push(new DestinoViaje(nombre, url));
    console.log(this.destinos);
    return false; //para eventos de un formulario, siempre se debe retornar false, si no se recarga la pagina
  }

  agregado(d: DestinoViaje){
    console.log("agregado:"+d)
    //this.destinosApiClient.add(d);
    this.destinos.push(d);
    this.onItemAdded.emit(d);
  }

  elegido(d: DestinoViaje){
    console.log('elegido:');
    this.destinos.forEach(function (x) {x.setSelected(false);} );
    d.setSelected(true);
  }

}
