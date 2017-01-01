import { Directive, ElementRef, forwardRef, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


export function IonicComponent(selector: string, componentType: string) {
  let directive: any;
  const host: any = {};

  const directiveObj: Directive = {
    selector: selector,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => directive),
      multi: true
    }],
    host: host
  };

  const clsDef: any = {
    constructor: [Renderer, ElementRef, function(renderer: Renderer, ele: ElementRef) {
      this._rndr = renderer;
      this._ele = ele.nativeElement;
    }],
  };

  if (componentType === 'checked') {
    // checkbox type components
    host['(ionChange)'] = 'onValueChanged($event)';

    clsDef.onValueChanged = function(ev: CustomEvent) {
      this.onChange(ev.detail);
    };

    clsDef.writeValue = function(val: any): void {
      this._rndr.setElementProperty(this._ele, 'checked', val);
    };

    clsDef.ngAfterContentInit = function() {
      this._ele.addEventListener('blur', () => this.onTouched(), true);
    };
  }

  if (componentType === 'checked') {
    // all form components
    clsDef.onChange = function (_: any) { };
    clsDef.onTouched = function () { };

    clsDef.registerOnChange = function(fn: (_: any) => void): void { this.onChange = fn; };
    clsDef.registerOnTouched = function(fn: () => void): void { this.onTouched = fn; };
  }

  directive = Directive(directiveObj).Class(clsDef);

  return directive;
}
