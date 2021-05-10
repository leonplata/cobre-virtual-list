import { LitElement, html, css, property, internalProperty, TemplateResult } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { calculateRange, RangeResult } from './math';
import { render } from 'lit-html';

export class VirtualListBase extends LitElement {

  @property({ type: Object })
  scrollTarget: HTMLElement = this;

  @property({ type: Array })
  items: any[] = [];

  @property({ type: Number })
  itemHeight: number = 24;

  @property({ type: Number })
  itemColumns: number = 1;

  @property({ type: Object })
  itemTemplate?: (item: any, slot: string, index: number) => TemplateResult;

  @internalProperty()
  private _range: RangeResult = { head: 0, length: 0 };

  private _resizeObserver: ResizeObserver = new ResizeObserver(this.calculateViewport);

  private _intersectionObserver: IntersectionObserver = new IntersectionObserver(this.handleIntersection, { threshold: [0] });

  constructor() {
    super();
    this.calculateViewport = this.calculateViewport.bind(this);
    this.handleIntersection = this.handleIntersection.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._intersectionObserver.observe(this);
    this.scrollTarget.addEventListener('scroll', this.calculateViewport);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.unobserve(this.scrollTarget);
    this._intersectionObserver.unobserve(this);
    this.scrollTarget.removeEventListener('scroll', this.calculateViewport);
  }

  calculateViewport() {
    if (this.scrollTarget) {
      const scrollTargetRect = this.scrollTarget.getBoundingClientRect();
      this._range = calculateRange(this.items.length, this.itemHeight, this.itemColumns, scrollTargetRect.height, this.scrollTarget.scrollTop);
    }
  }

  handleIntersection(entries: IntersectionObserverEntry[]) {
    const thisEntry = entries.find(entry => entry.target === this);
    if (thisEntry) {
      if (thisEntry.isIntersecting) {
        this._resizeObserver.observe(this.scrollTarget);
      } else {
        this._resizeObserver.unobserve(this.scrollTarget);
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      overflow-y: auto;
    }
    .container {
      position: relative;
    }
    .virtual-item {
      position: absolute;
      width: 100%;
    }
  `;

  private _renderItemTemplate() {
    const itemTemplate = this.itemTemplate;
    if (itemTemplate) {
      const templates = [];
      for (let realIndex = 0; realIndex < (this._range.length * this.itemColumns); realIndex += this.itemColumns) {
        const virtualIndex = (this._range.head * this.itemColumns) + realIndex;
        for (let c = 0; c < this.itemColumns; c++) {
          const item = this.items[virtualIndex + c];
          templates.push(itemTemplate(item, (realIndex + c).toString(), virtualIndex + c));
        }
      }
      render(html`${templates}`, this);
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('items')) {
      this.calculateViewport();
    }
    super.updated(changedProperties);
    this._renderItemTemplate();
  }

  firstUpdated() {
    this.calculateViewport();
  }

  render() {
    const height = `${this.items.length * this.itemHeight / this.itemColumns}px`;
    const containerStyle = styleMap({height});
    const slots = [];
    const width = (100 / this.itemColumns) + '%';
    for (let i = 0; i < (this._range.length * this.itemColumns); i++) {
      const position = (this._range.head + Math.floor(i / this.itemColumns)) * this.itemHeight;
      const transform = `translate3d(${100 * (i % this.itemColumns)}%, ${position}px, 0)`;
      const slotStyle = styleMap({transform, width});
      slots.push(html`<div class="virtual-item" style=${slotStyle}><slot name=${i}></slot></div>`);
    }
    return html`<div class="container" style=${containerStyle}>${slots}</div>`;
  }
}
