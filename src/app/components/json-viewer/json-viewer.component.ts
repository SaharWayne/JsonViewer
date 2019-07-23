import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class JsonViewerComponent implements OnInit {

  // This component should run dynamically. The host component should bind 'data' (JSON) to this component.
  // For reference, take a look at app.component.ts/displayJSON(...)
  data: JSON;
  html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  // On component init, build the JSON tree
  ngOnInit() {
    this.buildJsonTree();
  }

  buildJsonTree() {
    // Custom indent
    const indent = 40;
    // Prepare JSON wrapper ('{...}')
    let innerHTML = `<div class="div-level"><div class="div-level-extended"><div class="div-ext-prefix" style="cursor: default;"><p class="paragraph">-</p><p>{</p></div>`;

    // This is a recursive function that adds 'div-level' divs for each child in the JSON tree,
    // If the child is a father itself, the div will have 2 sub divs: 'div-level-collaped' & 'div-level-extended'
    // If the child has not children, the div will have 1 sub div: 'div-level-single'
    let rec = function (obj: any, key = undefined, isArray = false, levelId = "level_1") {

      // Open div-level
      innerHTML += `<div class="div-level" style="margin-left: ${indent}px;">`;

      // If the value of the child is an Array, convert to Object
      // This is done because even array values should be displayed with numeric keys (0: val, 1: val ...)
      const _data = isArray ? Object.assign({}, obj) : obj;

      // Iterate over the current level children
      Object.keys(_data).forEach(function (key, index, self) {
        let val = _data[key];
        let type = typeof (val);
        let id = `${levelId}_${index}`;
        let size = val ? Object.keys(val).length : 0;

        // If the type is string, we add '"' before and after the value
        if (type === 'string') {
          val = `"${val}"`;
        }

        // Open div-level for the current child
        innerHTML += `<div class="div-level" id="${id}">`;

        // Child with children
        if (type === 'object' && val && size > 0) {
          innerHTML += `<div class="div-level-collapsed" onclick="this.parentElement.children[0].style.display = 'none'; this.parentElement.children[1].style.display = 'flex';"><p class="paragraph-sign">+</p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p>${isArray ? 'Array(' + size + ')' : 'Object(' + size + ')'}</p></div>`;
          innerHTML += `<div class="div-level-extended" style="display: none;"><div class="div-ext-prefix" onclick="this.parentElement.style.display = 'none'; this.parentElement.parentElement.children[0].style.display = 'flex';"><p class="paragraph-sign">-</p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p>{</p></div>`;
          rec(val, key, Array.isArray(val), `${levelId}_${index}`);
          innerHTML += `<p class="paragraph-4">}</p></div>`;
        } else { // Child with no childre
          innerHTML += `<div class="div-level-single"><p class="paragraph-sign"></p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p><span class="${val ? type : 'undefined'}">${val ? (type == 'object' ? (isArray ? 'Array(' + size + ')' : 'Object(' + size + ')') : val) : '(' + val + ')'}</span></p></div>`;
        }

        // Close div-level of the current child
        innerHTML += `</div>`;

      });

      // Close div-level
      innerHTML += `</div>`;
    }

    // Run recursively on the data
    rec(this.data);
    // Close JSON wrapper
    innerHTML += `</div><p class="paragraph-4">}</p></div></div>`

    this.html = this.sanitizer.bypassSecurityTrustHtml(innerHTML);
  }



}
