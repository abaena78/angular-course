import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from '../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  //destinos: DestinoViaje[];
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: String[];

  constructor(public destinosApiClient:DestinosApiClient) {
    //this.destinos = []
    this.onItemAdded= new EventEmitter();
    this.updates = [];
    this.destinosApiClient.subscribeOnChange(
      (d: DestinoViaje) => {
        if ( d != null ){
          this.updates.push('se elige: ' + d.nombre);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  //Ya no se va a usar, se reemplaza por agregado
  // guardar(nombre:string, url:string):boolean{
  //   console.log("guardar:"+nombre+","+url)
  //   this.destinos.push(new DestinoViaje(nombre, url));
  //   console.log(this.destinos);
  //   return false; //para eventos de un formulario, siempre se debe retornar false, si no se recarga la pagina
  // }

  agregado(d: DestinoViaje){
    console.log("agregado:"+d)
    //this.destinosApiClient.add(d);
    //this.destinos.push(d);
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
  }

  elegido(d: DestinoViaje){
    console.log('elegido:');
    //this.destinos.forEach(function (x) {x.setSelected(false);} );
    //d.setSelected(true);
    this.destinosApiClient.elegir(d);
  }

}
