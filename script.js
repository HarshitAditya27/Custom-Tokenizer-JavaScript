import { CustomTokenizer } from "./tokenizer.js";

const tokenizer = new CustomTokenizer();

const qs = (s) => document.querySelector(s);
const trainText = qs("#trainText");
const learnBtn = qs("#learnBtn");
const viewVocabBtn = qs("#viewVocabBtn");
const vocabOutput = qs("#vocabOutput");
const encodeText = qs("#encodeText");
const encodeBtn = qs("#encodeBtn");
const encodeCsvBtn = qs("#encodeCsvBtn");
const encodedOutput = qs("#encodedOutput");
const decodeInput = qs("#decodeInput");
const decodeBtn = qs("#decodeBtn");
const decodedOutput = qs("#decodedOutput");

learnBtn.addEventListener("click", () => {
  const text = trainText.value.trim();
  if (!text) return alert("Please paste some training text first.");
  const added = tokenizer.learnVocab(text);
  vocabOutput.innerText = `Added ${added} tokens to vocab. Total size: ${
    Object.keys(tokenizer.vocab).length
  }`;
});

viewVocabBtn.addEventListener("click", () => {
  const entries = Object.entries(tokenizer.vocab).sort((a, b) => a[1] - b[1]);
  vocabOutput.innerText = entries
    .map(([t, id]) => `${id}\t${t}`)
    .slice(0, 1000)
    .join("\n");
});

encodeBtn.addEventListener("click", () => {
  const text = encodeText.value.trim();
  if (!text) return alert("Enter text to encode.");
  const ids = tokenizer.encode(text);
  encodedOutput.innerText = "Encoded IDs:\n" + ids.join(", ");
});

encodeCsvBtn.addEventListener("click", () => {
  const text = encodeText.value.trim();
  if (!text) return alert("Enter text to encode.");
  const ids = tokenizer.encode(text);
  encodedOutput.innerText = "Encoded CSV:\n" + ids.join(",");
});

decodeBtn.addEventListener("click", () => {
  const raw = decodeInput.value.trim();
  if (!raw) return alert("Enter token ids (comma separated).");
  const ids = raw
    .split(",")
    .map((x) => parseInt(x.trim()))
    .filter((x) => !Number.isNaN(x));
  const text = tokenizer.decode(ids);
  decodedOutput.innerText = text;
});

window.tokenizer = tokenizer;
