import { customElement } from 'lit-element';
import { VirtualListBase } from './oneup-virtual-list-base';

declare global {
  interface HTMLElementTagNameMap {
    'oneup-virtual-list': VirtualList;
  }
}

@customElement('oneup-virtual-list')
export class VirtualList extends VirtualListBase {}
