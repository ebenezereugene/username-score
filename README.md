# username-score

**An open-source engine exploring what makes a username memorable, human, and worth choosing.**

TypeScript · Open source · Early stage · Looking for contributors

---

## Why this exists

Every day, millions of people create usernames. And almost every platform asks exactly one question: is this available?

Not whether it's memorable. Not whether it's easy to say out loud or type without thinking. Not whether it feels like the person choosing it. Availability became the only signal that mattered somewhere along the way, so when the name you actually wanted is taken, most platforms "help" by handing you something like `jimoh23415` or `jimoh_8900`. Available, sure. Nobody's going to remember it though.

We think there's a better question worth asking: what actually makes a good username? That's what `username-score` is trying to figure out.

## More than a scoring library

A username is usually the first design decision someone makes inside a product. Before the avatar, before the bio, before the first post. It's the start of a person's digital identity, and most products treat it like a form field with a uniqueness constraint.

So we built something that measures the quality of a username, explains why it scored the way it did, and suggests alternatives that still feel like something a person would pick. Instead of `jimoh_8372`, `jimoh9911`, `jimoh__02`, you get `iamjimoh`, `thejimoh`, `jimohmedia`, `jimohprime`, `j1moh`. Not mutations of the original. Actual naming decisions.

## Why this is interesting

This sits somewhere between product design, human cognition, branding, linguistics, and software engineering, and honestly that's what makes it fun to work on. Why does `iamalex` feel better than `alex8894`? Why are some names easy to remember on the first read while others need three tries? What makes a username feel premium, and can "brandability" even be measured, or is that just a word we made up to sound rigorous?

Some of this needs code. Some of it just needs a good eye. Most of it needs both, which is part of why we wanted to open this up to a group like this one rather than keep tinkering with it alone.

## How it thinks about usernames

Every username gets evaluated across three pillars, loosely based on how people actually judge names when they hear them:

| Pillar | Question | Signals |
|---|---|---|
| **Scarcity** | Is it distinctive enough to feel unique? | Length, entropy, character complexity |
| **Fluency** | Can people read it, say it, remember it, type it? | Pronunciation, rhythm, readability |
| **Brandability** | Does it carry any meaning or identity? | Dictionary recognition, names, custom vocabulary |

These don't just get averaged together. A username that's memorable but impossible to pronounce shouldn't score well just because one number is high. And something easy to say but completely generic shouldn't either. The engine weighs them against each other instead.

## Features

Working today: deterministic scoring, explainable score breakdowns, human-first suggestion generation, a modular scoring engine, and support for custom brand vocabulary.

Still in progress: bigger linguistic datasets, better phonetic heuristics, more suggestion strategies, and support for languages beyond English.

## Installation

```bash
npm install username-score
```

## Usage

### Score a username

```typescript
import { score, analyze } from "username-score";

score("jimoh");
// 71.67
```

Want to know why it landed there?

```typescript
analyze("jimoh");
// {
//   total: 71.67,
//   pillars: { scarcity: ..., fluency: ..., brandability: ... },
//   features: [ { name: "length", score: ... }, ... ]
// }
```

Nothing here is a black box. Every score comes with a reason attached.

### Suggest better usernames

```typescript
import { generateUsernameSuggestions } from "username-score";

generateUsernameSuggestions("jimoh");
// [
//   { username: "iamjimoh", score: 84.17, strategy: "conversation" },
//   { username: "jimohmedia", score: 83.46, strategy: "creator" },
//   ...
// ]
```

These aren't random variations on the name. Each one comes from a distinct naming strategy and gets scored by the same engine before it's returned. If the library wouldn't recommend a name on its own, it doesn't suggest it either.

### Bring your own vocabulary

A fintech app, a gaming community, a design tool, and a healthcare product don't care about the same words. So you can tell the engine what matters to yours:

```typescript
score("kaibuilds", { brandTerms: ["kai"] });
```

A match against your own list counts for more than a generic dictionary hit, since it reflects your product's actual language instead of the dictionary at large.

## Architecture

```
              Username
                  │
                  ▼
         Parse & Normalize
                  │
                  ▼
         Feature Extraction
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
  Scarcity     Fluency    Brandability
      │           │           │
      └───────────┼───────────┘
                  ▼
           Final Username Score
                  │
                  ▼
     Username Suggestion Engine
```

The code is split by responsibility. `extractors/` measure raw characteristics of a username. `scorers/` turn those characteristics into explainable 0–100 scores. `engine/` combines the scores into the three pillars. `generator/` produces and ranks alternative names. Each piece is small enough to read in one sitting and test on its own.

## Where we're headed

Some things we want to try: industry-specific scoring (a username that works for a gaming clan probably shouldn't score the same way for a law firm), creator-focused naming strategies, better multilingual support, and benchmarking scores against real usernames people actually chose. Eventually a browser playground so people can try this without installing anything. We're building it in the open because we think more people looking at it will make it better than we could on our own.

## Contributing

This isn't only a coding project. It's a design problem, a language problem, a branding problem, and an engineering problem, all at the same time. If any one of those is your thing, there's something here for you, and you don't need to know TypeScript to make a real contribution.

If you think in design or branding, your instincts are useful data here. Score a few usernames you'd personally pick and see if the number matches your gut. When it doesn't, when two names feel equally good to you but land on very different scores, that gap is exactly the kind of thing we want to hear about. You can also help by suggesting new naming patterns, better creator-style words and prefixes, or just pushing back on what "brandability" should mean for different kinds of products.

If you think in product terms, help us stress-test the experience. Does the explanation behind a score actually make sense to someone reading it cold? Would a user trust this number? Is this the kind of thing that helps during onboarding, or does it just get in the way? A gaming platform and a fintech app probably shouldn't judge usernames the same way, and we haven't fully worked out how that difference should show up yet.

If you're technical, the codebase is split up enough that you can dig into one piece without needing to understand the whole thing first. There's real work to do on phonetic transition detection, pronunciation heuristics, leetspeak and stylization handling, cleaning up dataset quality, calibrating the scoring itself, and building out proper evaluation benchmarks. If you're into NLP, linguistics-adjacent engineering, or recommendation-style problems, this is small enough to fully understand and real enough that the work actually matters.

To contribute: fork the repo. For anything beyond a small fix, open an issue first so we can talk it through before you spend time building. Small, focused pull requests are easier to review than big ones, so tackle one strategy, one fix, or one dataset improvement at a time. And if you're not sure where to start, just score ten usernames you know well and tell us what felt off. That alone is a real contribution.

## Project status

Done: username parsing, feature extraction, the explainable scoring engine, and the suggestion engine.

In progress: better pronunciation heuristics, bigger linguistic datasets, more suggestion strategies, support for other languages, a browser playground, and benchmarking against real-world usernames.

## Why open source

Nobody's really tried to answer this question in the open before. Most platforms just check availability and call it done. We want to understand why some usernames feel better than others, and we'd rather figure that out with other people than alone. Whether you think in interfaces, psychology, branding, linguistics, or code, there's probably an angle here you'd be good at.

## Join us

A username is often the first piece of identity someone builds online. That deserves more thought than a random number stuck on the end of a name. If this idea interests you, come help us figure out what actually makes a good one.

## License

MIT