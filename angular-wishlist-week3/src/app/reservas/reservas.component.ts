import { Component, OnInit } from '@angular/core';
import { ReservasApiClientService } from './reservas-api-client.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  constructor(public api: ReservasApiClientService) { }

  ngOnInit(): void {
  }

}
