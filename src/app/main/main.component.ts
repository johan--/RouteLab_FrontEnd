import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
declare var $: any;
declare var jquery: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private BG = ('../../assets/img/home_bg.png');
  category = 'Select category';
  categories =['Sol y playa', 'Deportivo', 'Naturaleza', 'De montaña', 'Histórico', 'Aventura', 'Rural', 'Científico'];
  assignBlack () {
    const element = document.getElementById('addBlack');
    element.classList.add('black');
  }
  constructor() { }

  ngOnInit() {
  }

}
