import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

//OL IMPORTS
import { Coordinate } from 'ol/coordinate';
import { Feature, Overlay } from 'ol';
import { Icon, Style } from 'ol/style';
import { Point } from 'ol/geom';
import { useGeographic } from 'ol/proj.js';
import { XYZ } from 'ol/source';
import Attribution from 'ol/control/Attribution.js';
import Control from 'ol/control/Control';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';

declare var bootstrap: any;

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css',
})
export class FullScreenPageComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('map') divMap?: ElementRef;
  @ViewChild('popup') popupDiv?: ElementRef;


  private attr? = new Attribution({});
  public center : Coordinate = [2.825535, 41.973237]

  public features?: Feature[] = [
    new Feature({ geometry: new Point(this.center), name: 'Nexus Geographics' }),
  ];
  public markerStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'assets/map-marker-svgrepo-com.svg',
      color: 'red',
      scale: 0.07,
    }),
  });

  public map? : Map;
  public popover? : any
  public popup? : Overlay


  ngAfterViewInit(): void {
    if (!this.divMap || !this.popupDiv ) throw new Error('View is not initialized');

    useGeographic();

    this.map = new Map({
      target: this.divMap.nativeElement,
      view: new View({
        center: this.center,
        zoom: 19,
      }),
      layers: [new TileLayer({ source: new XYZ({url : 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}) }), new VectorLayer({
        source: new VectorSource({ features: this.features }),
        style: this.markerStyle,
      }),],
      controls: [this.attr as Control],
    });

    this.popup	= new Overlay({
      element : this.popupDiv.nativeElement,
      positioning : 'bottom-center',
      stopEvent : false,
    })
    this.map.addOverlay(this.popup);


    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.disposePopover();
    this.map!.dispose();
  }

  disposePopover(){
    if(!this.popover) return;

    this.popover.dispose();
    this.popover = undefined;
  }

  mapListeners(): void {

    if(!this.map) return;

    this.map.on('click', (evt) => {
      const feature = this.map!.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature;
      });

      this.disposePopover();
      if (!feature) return;

      console.log(evt.coordinate);
      this.popup!.setPosition(evt.coordinate);

    

      this.popover = new bootstrap.Popover(this.popupDiv?.nativeElement, {
        placement: 'auto',
        html: true,
        content: feature.get('name'),
      });
      this.popover.show();
    });


    // change mouse cursor when over marker
    this.map.on('pointermove', (e) => {
      
      const pixel = this.map!.getEventPixel(e.originalEvent);
      const hit = this.map!.hasFeatureAtPixel(pixel);
      this.divMap!.nativeElement.style.cursor = hit ? 'pointer' : '';
    });

    // Close the popup when the map is moved
    this.map.on('movestart', (ev) => {
      console.log('hehe');
      this.disposePopover();
      
    });
  }

}
