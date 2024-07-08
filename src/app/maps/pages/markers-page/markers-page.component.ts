import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Coordinate } from 'ol/coordinate';
import { Geometry } from 'ol/geom';
import { Icon, Stroke, Style } from 'ol/style';
import { Modify, Select } from 'ol/interaction.js';
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
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap?: ElementRef;

  private attr? = new Attribution({});
  public zoom: number | undefined = 15;
  public center: Coordinate = [2.825535, 41.973237];
  public lngLat: Coordinate = this.center;

  public map?: Map;
  public view?: View;
  public vectorLayer?: VectorLayer<Feature<Geometry>>;
  public modify?: Modify;

  public features?: Feature[] = [
    new Feature({ geometry: new Point(this.center) }),
  ];

  getRandomColor(): string {
    return `${'#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    )}`;
  }
  createNewFeatureStyle(): Style {
    return new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/map-marker-svgrepo-com.svg',
        scale: 0.07,
        color: this.getRandomColor(),
      }),
    });
  }

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
        (this.vectorLayer = new VectorLayer({
          source: new VectorSource({ features: this.features }),
          style: this.createNewFeatureStyle(),
        })),
      ],
      controls: [this.attr as Control],
    });

    // const select = new Select({});
    // this.map.addInteraction(select);

    this.modify = new Modify({
      hitDetection: this.vectorLayer,
      source: this.vectorLayer.getSource()!,
      //features: select.getFeatures(),
    });
    this.map.addInteraction(this.modify);

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map!.dispose();
  }

  mapListeners(): void {
    //war crimes
    if (
      !this.map ||
      !this.view ||
      !this.modify ||
      !this.vectorLayer ||
      !this.divMap
    ) {
      throw new Error('Map or View or Modify are not initialized ');
    }

    this.view.on('change:center', (e) => {
      this.lngLat = this.view!.getCenter()!;
    });

    this.modify.on(['modifystart', 'modifyend'], (evt) => {
      this.divMap!.nativeElement.style.cursor =
        evt.type === 'modifystart' ? 'grabbing' : 'pointer';
    });
    const overlaySource = this.modify.getOverlay().getSource();
    overlaySource!.on(['addfeature', 'removefeature'], (evt) => {
      this.divMap!.nativeElement.style.cursor =
        evt.type === 'addfeature' ? 'pointer' : '';
    });

    this.modify.on('modifystart', (event) => {
      console.log('Start modifying feature', event.features.getArray());
    });

    this.modify.on('modifyend', (event) => {
      console.log('End modifying feature', event.features.getArray());
    });
  }

  initializeMarker() {
    if (!this.map || !this.view) return;

    const location = this.lngLat;
    const color = this.getRandomColor();

    this.addMarker(location, color);
  }

  addMarker(lngLat: Coordinate, color: string): void {
    if (!this.map || !this.view || !this.vectorLayer) return;

    const offsetLngLat = [
      lngLat[0] + (Math.random() - 0.5) / 1000,
      lngLat[1] + (Math.random() - 0.5) / 1000,
    ] as Coordinate;
    const marker = new Feature({ geometry: new Point(offsetLngLat) });

    marker.setStyle(this.createNewFeatureStyle());

    this.features?.push(marker);
    console.log(this.vectorLayer.getSource()?.getFeatures());

    this.vectorLayer.getSource()?.addFeature(marker);
  }
  centerMap() {
    if (!this.view) return;
    if (this.view.getCenter() == this.center) return;

    this.view.animate({ center: this.center, duration: 1000 });
    this.view.animate({ zoom: this.view.getMaxZoom(), duration: 1000 });
  }
}
