import { DICTIONARY } from "./dictionaries/index.dictionaries.js";
import { entropyExtractor } from "./extractors/entropy.js";
import { extractFeatures } from "./extractors/index.extractors.js";
import { evaluateLength, lengthExtractor } from "./extractors/length.js";
import { pronunciationExtractor } from "./extractors/pronunciation.js";
import { readabilityExtractor } from "./extractors/readability.js";
import { repetitionExtractor } from "./extractors/repetition.js";
import { parseUsername } from "./parser/parser.js";

// const result = parseUsername("John_Doe99🔥");
// const otherResult = parseUsername("dennison");
// // console.log(JSON.stringify(result, null, 2));

// console.log("length:", lengthExtractor.extract(result));
// console.log("repetition:", repetitionExtractor.extract(otherResult));

// console.log("entropy:", entropyExtractor.extract(otherResult));
// console.log("readability:", readabilityExtractor.extract(otherResult));
// console.log("pronunciation:", pronunciationExtractor.extract(otherResult));

// console.log("DICTIONARY entry for 'john':", DICTIONARY.get("john"));

const parsed = parseUsername("johnsmith99");

const features = extractFeatures(parsed);


console.log(features);
