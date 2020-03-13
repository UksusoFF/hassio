class TOSamaraCard extends HTMLElement {

    BUS_ICON = '<path fill="currentColor" d="M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z" />';
    RAIL_ICON = '<path fill="currentColor" d="M19,16.94V8.5C19,5.71 16.39,5.1 13,5L13.75,3.5H17V2H7V3.5H11.75L11,5C7.86,5.11 5,5.73 5,8.5V16.94C5,18.39 6.19,19.6 7.59,19.91L6,21.5V22H8.23L10.23,20H14L16,22H18V21.5L16.5,20H16.42C18.11,20 19,18.63 19,16.94M12,18.5A1.5,1.5 0 0,1 10.5,17A1.5,1.5 0 0,1 12,15.5A1.5,1.5 0 0,1 13.5,17A1.5,1.5 0 0,1 12,18.5M17,14H7V9H17V14Z" />'
    TROL_ICON = '<path fill="currentColor" d="M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z" />';
    METRO_ICON = '<path fill="currentColor" d="M8.5,15A1,1 0 0,1 9.5,16A1,1 0 0,1 8.5,17A1,1 0 0,1 7.5,16A1,1 0 0,1 8.5,15M7,9H17V14H7V9M15.5,15A1,1 0 0,1 16.5,16A1,1 0 0,1 15.5,17A1,1 0 0,1 14.5,16A1,1 0 0,1 15.5,15M18,15.88V9C18,6.38 15.32,6 12,6C9,6 6,6.37 6,9V15.88A2.62,2.62 0 0,0 8.62,18.5L7.5,19.62V20H9.17L10.67,18.5H13.5L15,20H16.5V19.62L15.37,18.5C16.82,18.5 18,17.33 18,15.88M17.8,2.8C20.47,3.84 22,6.05 22,8.86V22H2V8.86C2,6.05 3.53,3.84 6.2,2.8C8,2.09 10.14,2 12,2C13.86,2 16,2.09 17.8,2.8Z" />';

    _station
    _counter

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        });
    }

    getCardSize() {
        return 1;
    }

    setConfig(config) {
        if (!config.station) {
            throw new Error('Please define an station');
        }

        if (!config.title) {
            throw new Error('Please define an station');
        }

        this._station = config.station;

        const root = this.shadowRoot;

        if (root.lastChild) {
            root.removeChild(root.lastChild)
        }

        const wrap = document.createElement('ul');
        wrap.id = 'tosamara-card-arrival-list';

        const card = document.createElement('ha-card');
        card.appendChild(wrap);
        card.header = config.title;

        root.appendChild(card);

        const style = document.createElement('style');
        style.textContent = `
ul#tosamara-card-arrival-list {
  list-style-type: none;
  margin: 0 16px;
  padding: 0;
  max-height: 200px;
  overflow-y: auto; }
  ul#tosamara-card-arrival-list li {
    pointer-events: none;
    clear: both;
    margin: 0 0 15px 0;
    border-bottom: 1px dotted #cbcbcb; }
    ul#tosamara-card-arrival-list li a {
      color: inherit;
      text-decoration: none; }
      ul#tosamara-card-arrival-list li a .time-arrive {
        float: left;
        width: 40px;
        text-align: center; }
      ul#tosamara-card-arrival-list li a .trans-ico {
        float: right;
        width: 40px;
        text-align: center; }
      ul#tosamara-card-arrival-list li a .trans-name {
        font-size: 15px;
        line-height: 15px;
        margin-bottom: 10px;
        margin-left: 40px;
        margin-right: 40px; }
      ul#tosamara-card-arrival-list li a .trans-detail {
        font-size: 11px;
        line-height: 11px;
        margin-bottom: 5px;
        margin-left: 40px;
        margin-right: 40px; }`;

        root.appendChild(style);
    }

    set hass(hass) {
        const root = this.shadowRoot;

        if (typeof this._counter === 'undefined') {
            this._counter = this._startTimer();
        }

        root.lastChild.hass = hass;
    }

    _startTimer() {
        this._updateCard();

        return setInterval(() => {
            this._updateCard();
        }, 60000);
    }

    _updateCard() {
        const root = this.shadowRoot;

        let xhReq = new XMLHttpRequest();
        xhReq.open('POST', 'http://m.tosamara.ru/xml_bridge.php?method=getFirstArrivalToStop&KS_ID=' + this._station + '&COUNT=10&version=mobile', false);
        xhReq.send(null);

        const container = root.getElementById('tosamara-card-arrival-list');
        container.innerHTML = xhReq.responseText;

        const map = {
            'bus': this.BUS_ICON,
            'rail': this.RAIL_ICON,
            'trol': this.TROL_ICON,
            'metro': this.METRO_ICON,
        }

        for (const key in map) {
            const elements = container.getElementsByClassName(`trans-ico-${ key }`)
            for (let i = 0; i < elements.length; i += 1) {
                const icons = container.getElementsByClassName('trans-ico')
                for (let i = 0; i < elements.length; i += 1) {
                    icons[i].innerHTML = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">${ map[key] }</svg>`;
                }
            }
        }

    }
}

customElements.define('tosamara-card', TOSamaraCard);