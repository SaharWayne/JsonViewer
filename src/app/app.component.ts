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

  onSubmit(f: NgForm) {
    if (f.disabled) { // previous submit in progress
      return;
    }

    if ("url" in f.value) {
      let url = f.value["url"];

      if (url.length > 0) {
        f.control["disable"]();

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

  displayJSON(data: JSON) {
    // Destroy previous active component
    if (this.jsonViewerCompRef) {
      this.jsonViewerCompRef.Destroy();
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
