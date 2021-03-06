import { Component, OnInit } from '@angular/core';
import { FetcherService } from './fetcher.service';
import { JsonViewerComponent } from './components/json-viewer/json-viewer.component';
import { NgForm } from '@angular/forms';

import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injector } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'JsonViewer';
  jsonViewerCompRef: any;

  constructor(private fetcherService: FetcherService, private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  ngOnInit() {
  }

  // On url submit, fetch the JSON using the fetcher service (implements an http get request)
  onSubmit(f: NgForm) {
    if (f.disabled) { // if previous submit is in progress, do nothing
      return;
    }

    // Check input validity
    if ("url" in f.value) {
      let url = f.value["url"];

      // Check input validity
      if (url.length > 0) {
        f.control["disable"]();

        // Fetch JSON
        this.fetcherService.fetchJSON(url).subscribe(data => {
          this.displayJSON(data);
          f.control["enable"]();
        }, error => {
          alert('Invalid JSON url');
          f.control["enable"]();
        });


      }
    }
  }

  // Once JSON is fetched, this function dynamically creates JsonViewer Component and displays it
  displayJSON(data: JSON) {
    // Destroy previous active component
    if (this.jsonViewerCompRef) {
      this.jsonViewerCompRef.destroy();
    }

    // Create a component reference from the component
    this.jsonViewerCompRef = this.componentFactoryResolver
      .resolveComponentFactory(JsonViewerComponent).create(this.injector);

    // Bind data to component’s inputs
    this.jsonViewerCompRef.instance.data = data;

    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.jsonViewerCompRef.hostView);

    // Get DOM element from component
    const domElem = (this.jsonViewerCompRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // Append Loding DOM element to the body
    document.getElementById('jsonViewerContainer').appendChild(domElem);
  }
}
