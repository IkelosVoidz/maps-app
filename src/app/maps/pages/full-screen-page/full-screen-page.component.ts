import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

//OL IMPORTS
import { useGeographic } from 'ol/proj.js';
import Attribution from 'ol/control/Attribution.js';
import Control from 'ol/control/Control';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css',
})
export class FullScreenPageComponent implements AfterViewInit {
  @ViewChild('map') divMap?: ElementRef;

  private attr? = new Attribution({});

  ngAfterViewInit(): void {
    if (!this.divMap) throw new Error('Map is not initialized');

    useGeographic();

    new Map({
      target: this.divMap.nativeElement,
      view: new View({
        center: [2.825535, 41.973237],
        zoom: 19,
      }),
      layers: [new TileLayer({ source: new OSM() })],
      controls: [this.attr as Control],
    });
  }
}
