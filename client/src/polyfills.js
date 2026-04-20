// Pure JS URL polyfill — no native dependencies
if (typeof global.URL === 'undefined') {
  global.URL = class URL {
    constructor(url) {
      const match = String(url).match(
        /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/
      );
      this.href     = url;
      this.protocol = match[2] ? match[2] + ':' : '';
      this.host     = match[4] || '';
      this.pathname = match[5] || '/';
      this.search   = match[6] || '';
      this.hash     = match[8] || '';
      this.origin   = this.protocol + '//' + this.host;
    }
    toString() { return this.href; }
  };
}
