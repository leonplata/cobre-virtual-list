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
  itemTemplate?: (item: any, slot: string) => TemplateResult;

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
      position: relative;
    }
  `;

  private _renderItemTemplate() {
    const itemTemplate = this.itemTemplate;
    if (itemTemplate) {
      const templates = [];
      for (let i = 0; i < this._range.length; i++) {
        const item = this.items[this._range.head + i];
        templates.push(itemTemplate(item, i.toString()));
      }
      render(html`${templates}`, this);
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    this._renderItemTemplate();
  }

  firstUpdated() {
    this.calculateViewport();
  }

  render() {
    const height = `${this.items.length * this.itemHeight}px`;
    const containerStyle = styleMap({height});
    const slots = [];
    for (let i = 0; i < this._range.length; i++) {
      const position = (this._range.head + i) * this.itemHeight;
      const transform = `translate3d(0, ${position}px, 0)`;
      const slotStyle = styleMap({transform, position: 'absolute'});
      slots.push(html`<div style=${slotStyle}><slot name=${i}></slot></div>`);
    }
    return html`<div style=${containerStyle}>${slots}</div>`;
  }
}
