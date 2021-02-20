import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.module';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { DestinosApiClient } from '../../models/destinos-api-client.model';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  //destinos: DestinoViaje[];
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  updates: String[];
  all;

  constructor(public destinosApiClient:DestinosApiClient, private store: Store<AppState>) {
    //this.destinos = []
    this.onItemAdded= new EventEmitter();
    this.updates = [];
    this.store.select(state => state.destinos.favorito) //solo interesa la parte favorito
    .subscribe( d => {
      if(d != null) {
        this.updates.push('Se ha elegido a '+d.nombre);
      }
    })

    store.select(state => state.destinos.items).subscribe(items => this.all = items);

  }

  ngOnInit(): void {
  }

  agregado(d: DestinoViaje){
    console.log("agregado:"+d)
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    //this.store.dispatch(new NuevoDestinoAction(d)); //dispara accion
  }

  elegido(d: DestinoViaje){
    console.log('elegido:');
    this.destinosApiClient.elegir(d);
    //this.store.dispatch(new ElegidoFavoritoAction(d)); //dispara accion
  }


}
