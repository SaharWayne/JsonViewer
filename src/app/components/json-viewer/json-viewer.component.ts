import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class JsonViewerComponent implements OnInit {

  // This component should run dynamically. The host component should bind 'data' to this component.
  // For reference, take a look at app.component.ts/displayJSON
  data: JSON;
  html: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.buildJsonTree();
  }

  buildJsonTree() {
    let indent = 40;
    let innerHTML = `<div class="div-level"><div class="div-level-extended"><div class="div-ext-prefix" style="cursor: default;"><p class="paragraph">-</p><p>{</p></div>`;

    let rec = function (obj: any, key = undefined, isArray = false, levelId = "level_1") {
      innerHTML += `<div class="div-level" style="margin-left: ${indent}px;">`;


      const _data = isArray ? Object.assign({}, obj) : obj;
      Object.keys(_data).forEach(function (key, index, self) {
        let val = _data[key];
        let type = typeof (val);
        let id = `${levelId}_${index}`;
        let el = document.getElementById(id);
        let size = val ? Object.keys(val).length : 0;

        if (type === 'string') {
          val = `"${val}"`;
        }

        innerHTML += `<div class="div-level" id="${id}">`;

        if (type === 'object' && val && size > 0) {
          innerHTML += `<div class="div-level-collapsed" onclick="this.parentElement.children[0].style.display = 'none'; this.parentElement.children[1].style.display = 'flex';"><p class="paragraph-sign">+</p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p>${isArray ? 'Array(' + size + ')' : 'Object(' + size + ')'}</p></div>`;
          innerHTML += `<div class="div-level-extended" style="display: none;"><div class="div-ext-prefix" onclick="this.parentElement.style.display = 'none'; this.parentElement.parentElement.children[0].style.display = 'flex';"><p class="paragraph-sign">-</p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p>{</p></div>`;
          rec(val, key, Array.isArray(val), `${levelId}_${index}`);
          innerHTML += `<p class="paragraph-4">}</p></div>`;
        } else {
          innerHTML += `<div class="div-level-single"><p class="paragraph-sign"></p><p class="paragraph-2">${key}</p><p class="paragraph-3">:</p><p><span class="${val ? type : 'undefined'}">${val ? (type == 'object' ? (isArray ? 'Array(' + size + ')' : 'Object(' + size + ')') : val) : '(' + val + ')'}</span></p></div>`;
        }

        innerHTML += `</div>`;

      });

      innerHTML += `</div>`;
    }
    rec(this.data);
    innerHTML += `</div><p class="paragraph-4">}</p></div></div>`

    this.html = this.sanitizer.bypassSecurityTrustHtml(innerHTML);
  }



}
