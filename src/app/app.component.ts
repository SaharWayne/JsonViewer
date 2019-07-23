import { Component, OnInit } from '@angular/core';
import { FetcherService } from './fetcher.service';
import { JsonViewerComponent } from './components/json-viewer/json-viewer.component';
import { NgForm } from '@angular/forms';

import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injector } from '@angular/core';

import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JsonViewer';
  // data = JSON.parse(JSON.stringify({
  //   str: 'Hello',
  //   obj: [
  //     'hello'
  //   ],
  //   boolean: true,
  //   number: 124
  // }))

  data = JSON.parse(JSON.stringify(
    {
      count: 87,
      next: "https://swapi.co/api/people?page=2",
      previous: null,
      results: [
        {
          birth_year: "112BBY",
          vehicles: []
        }
      ]
    }));

  constructor(private fetcherService: FetcherService, private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  ngOnInit() {
    // console.log(this.data);
    // this.displayJSON(this.data);
  }

  onSubmit(f: NgForm) {
    console.log('hello')
    if (f.disabled) { // previous submit in progress
      return;
    }

    if ("url" in f.value) {
      let url = f.value["url"];

      if (url.length > 0) {
        f.control["disable"]();

        this.fetcherService.fetchJSON(url).subscribe(data => {
          // console.log('done')
          this.displayJSON(data);
          f.control["enable"]();
        }, error => {
          alert('Invalid JSON url');
          f.control["enable"]();
        });


      }
    }
  }

  displayJSON(data: JSON) {
    // Create a component reference from the component
    const jsonViewerCompRef = this.componentFactoryResolver
      .resolveComponentFactory(JsonViewerComponent).create(this.injector);

    // Bind data to component’s inputs
    jsonViewerCompRef.instance.data = data;

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(jsonViewerCompRef.hostView);

    // Get DOM element from component
    const domElem = (jsonViewerCompRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // Append Loding DOM element to the body
    document.getElementById('jsonViewerContainer').appendChild(domElem);
  }
}
