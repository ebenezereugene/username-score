import { dictionaryExtractor } from "./extractors/dictionary.js";
import { extractFeatures } from "./extractors/index.extractors.js";
import { pronunciationExtractor } from "./extractors/pronunciation.js";
import { readabilityExtractor } from "./extractors/readability.js";
import { parseUsername } from "./parser/parser.js";
import { dictionaryScorer } from "./scorers/dictionary.js";
import { scoreLength } from "./scorers/length.js";
import { pronunciationScorer } from "./scorers/pronunciation.js";
import { readabilityScorer } from "./scorers/readability.js";

const parsed = parseUsername("eugeneebenezer");

const features = extractFeatures(parsed);

// console.log(features);
const scoreLengthResult = scoreLength(parsed);
// console.log(scoreLengthResult);


const feature = dictionaryExtractor.extract(parsed);
// console.log("feature:", feature);

const score = dictionaryScorer.score(feature.metadata);

// console.log("dictionary score",score);


const pronounciationFeature = pronunciationExtractor.extract(parsed);
const pronunciationscore = pronunciationScorer.score(pronounciationFeature.metadata);

// console.log("pronunciationScore:", pronunciationscore);



const readabilityFeature = readabilityExtractor.extract(parsed)



const readabilityScore = readabilityScorer.score(readabilityFeature.metadata)

console.log("readabilityscore", readabilityScore);