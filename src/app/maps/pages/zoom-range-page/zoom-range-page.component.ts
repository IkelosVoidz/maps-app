import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Coordinate } from 'ol/coordinate';
import { Icon, Style } from 'ol/style';
import { OSM } from 'ol/source';
import { useGeographic } from 'ol/proj';
import { View } from 'ol';
import Attribution from 'ol/control/Attribution';
import Control from 'ol/control/Control';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css',
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap?: ElementRef;

  private attr? = new Attribution({});
  public zoom: number | undefined = 10;
  public center: Coordinate = [2.825535, 41.973237];
  public lngLat: Coordinate = this.center; //i guess this works but its shit

  public map?: Map;
  public view?: View;

  public markerStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'assets/map-marker-svgrepo-com.svg',
      color: `${'#xxxxxx'.replace(/x/g, (y) =>
        ((Math.random() * 16) | 0).toString(16)
      )}`,
      scale: 0.07,
    }),
  });
  public features?: Feature[] = [
    new Feature({ geometry: new Point(this.center) }),
  ];

  ngAfterViewInit(): void {
    if (!this.divMap) throw new Error('Map HTML element is not initialized');

    useGeographic();

    this.view = new View({
      center: this.center,
      zoom: this.zoom,
    });
    this.view?.setMaxZoom(19);
    this.view?.setMinZoom(1.89);

    this.map = new Map({
      target: this.divMap.nativeElement,
      view: this.view,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: new VectorSource({ features: this.features }),
          style: this.markerStyle,
        }),
      ],
      controls: [this.attr as Control],
    });
    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map!.dispose();
  }

  mapListeners(): void {
    if (!this.map || !this.view) {
      throw new Error('Map or View are not initialized ');
    }

    this.view.on('change:resolution', (event) => {
      this.zoom = this.view!.getZoom();
    });

    this.view.on('change:center', (e) => {
      this.lngLat = this.view!.getCenter()!;
    });
  }

  zoomIn() {
    if (!this.view) return;
    if (this.view.getZoom()! >= this.view.getMaxZoom()!) return;

    let zoomVal = this.view.getZoom();
    this.view.animate({ zoom: zoomVal! + 1, duration: 250 });
  }

  zoomOut() {
    if (!this.view) return;
    if (this.view.getZoom()! <= this.view.getMinZoom()!) return;

    let zoomVal = this.view.getZoom();
    this.view.animate({ zoom: zoomVal! - 1, duration: 250 });
  }

  centerMap() {
    if (!this.view) return;
    if (this.view.getCenter() == this.center) return;

    this.view.animate({ center: this.center, duration: 1000 });
    this.view.animate({ zoom: this.view.getMaxZoom(), duration: 1000 });
  }

  zoomChanged(value: string) {
    if (!this.view) return;

    this.zoom = Number(value);

    // this.view.setZoom(this.zoom);
    this.view.animate({ zoom: this.zoom, duration: 100 });
  }
}
