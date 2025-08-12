export class CustomTokenizer {
  constructor() {
    // special tokens with fixed IDs
    this.specialTokens = { "<PAD>": 0, "<UNK>": 1, "<START>": 2, "<END>": 3 };
    this.vocab = Object.assign({}, this.specialTokens); // token -> id
    this.reverseVocab = {};
    Object.entries(this.vocab).forEach(
      ([t, id]) => (this.reverseVocab[id] = t)
    );
    this.nextId = Object.keys(this.vocab).length;
  }

  // simple normalizer: lowercase + separate punctuation
  _normalize(text) {
    return text
      .replace(/\u2019/g, "'") // curly apostrophe
      .toLowerCase()
      .replace(/([.,!?;:\/()"\[\]{}<>])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // split into tokens (word-level)
  _tokenize(text) {
    const norm = this._normalize(text);
    if (!norm) return [];
    return norm.split(" ");
  }

  // learn vocab from a large text; returns number of new tokens added
  learnVocab(text) {
    const tokens = this._tokenize(text);
    let added = 0;
    for (const t of tokens) {
      if (!(t in this.vocab)) {
        this.vocab[t] = this.nextId;
        this.reverseVocab[this.nextId] = t;
        this.nextId += 1;
        added += 1;
      }
    }
    return added;
  }

  // encode: returns array of token IDs (includes START and END)
  encode(text) {
    const tokens = this._tokenize(text);
    const ids = [this.vocab["<START>"]];
    for (const t of tokens) {
      ids.push(
        this.vocab.hasOwnProperty(t) ? this.vocab[t] : this.vocab["<UNK>"]
      );
    }
    ids.push(this.vocab["<END>"]);
    return ids;
  }

  // decode: converts ids to text (skips special tokens except unknown placeholder)
  decode(ids) {
    const words = ids.map((id) =>
      this.reverseVocab[id] !== undefined ? this.reverseVocab[id] : "<UNK>"
    );
    // remove START/END/PAD in output text
    const filtered = words.filter(
      (w) => !["<START>", "<END>", "<PAD>"].includes(w)
    );
    return filtered.join(" ").replace(/\s+([.,!?;:\/()"\[\]{}<>])/g, "$1");
  }

  // export/import vocab as JSON
  exportVocab() {
    return JSON.stringify(this.vocab, null, 2);
  }
  importVocab(jsonStr) {
    const obj = JSON.parse(jsonStr);
    this.vocab = Object.assign({}, this.specialTokens, obj);
    this.reverseVocab = {};
    Object.entries(this.vocab).forEach(
      ([t, id]) => (this.reverseVocab[id] = t)
    );
    this.nextId = Math.max(...Object.values(this.vocab)) + 1;
  }
}
