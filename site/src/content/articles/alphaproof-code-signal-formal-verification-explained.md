---
title: "AlphaProof Code Explained: How Google DeepMind’s AI Proved Signal’s Encryption Code Secure, and What It Didn’t Prove"
seoTitle: "AlphaProof Code: AI Verifies Signal’s Code, Explained"
description: "Google DeepMind’s AI agents wrote about 6.5 million lines of Lean proof showing Signal’s compiled code keeps key security promises. What was proved, what wasn’t, and why it matters."
category: "research"
image: "/images/articles/alphaproof-code-signal-formal-verification-explained/hero.jpg"
imageAlt: "AlphaProof Code Explained: How Google DeepMind’s AI Proved Signal’s Encryption Code Secure, and What It Didn’t Prove"
tags: ["Google DeepMind", "Formal verification", "Cybersecurity"]
date: "2026-11-21T07:30:00Z"
takeaways:
  - "On 10 November 2026 Google DeepMind said its AlphaProof Code agents proved key security properties of libsignal, the Signal protocol’s reference code, down to compiled ARM machine code."
  - "The agents generated about 6.5 million lines of machine-checked Lean proof, resting on about 26,000 lines of specifications and machine semantics that humans must trust."
  - "A team of five did the proof work in four weeks; DeepMind compares that with 20 person-years for the seL4 kernel and six for the CompCert compiler."
  - "The proofs cover one-to-one sessions only: group messaging, side channels and a quantum attacker are out of scope, and the cryptographic primitives are assumed secure."
  - "DeepMind is open-sourcing the specifications and proofs, and Signal’s CTO called the work “a great breakthrough”."
---
## The bottom line

**Google DeepMind says AI agents have mathematically proved that the code behind the Signal protocol delivers key security guarantees, not just on paper but in the compiled program that runs on devices.** The system, called AlphaProof Code, produced about 6.5 million lines of machine-checked proof in the Lean language, covering Signal’s post-quantum handshake and its “Triple Ratchet” message encryption. [1][2]

DeepMind calls these the first proofs that connect protocol-level security guarantees to the unmodified code of a widely used cryptographic implementation. [2] Signal’s chief technology officer, Ehren Kret, called the use of AI agents to turn live code into Lean theorems “a great breakthrough”. [1]

The proofs are real but bounded. They cover one-to-one chats, not groups. They assume the underlying cryptography is sound. They also leave out side-channel attacks and a quantum attacker. [2] What changed is the cost: a five-person team finished the proof work in four weeks. [2]

## Key facts at a glance

| | |
|---|---|
| Announced | 10 November 2026 [1] |
| System | AlphaProof Code, a multi-agent framework for formal verification [1][2] |
| Code verified | libsignal v0.105.4, the Signal protocol’s reference implementation, one-to-one sessions [2] |
| Level | Compiled AArch64 (64-bit ARM) Linux machine code, built with the standard Rust compiler [2] |
| Proof size | About 6.5 million lines of Lean [2] |
| What must be trusted | About 26,000 lines: ~18,000 of specifications plus ~8,000 of ARM semantics and symbol names [2] |
| Properties proved | Forward secrecy, authentication, post-compromise security, handshake secrecy [2] |
| Effort | A team of five, four weeks [2] |
| Model used | Agents powered by Gemini Carbon [1] |
| Availability | Lean specifications and proofs published openly [1][2] |

## What is formal verification, and why is it so rare?

Most software is checked by testing and code review, which can find bugs but can’t show that none remain. **Formal verification** writes down exactly what a program must do, as a mathematical specification, and then proves that the code always meets it. DeepMind calls it “the highest standard of security assurance”. [1]

The catch has always been cost. DeepMind’s paper notes that the verified seL4 microkernel took twenty person-years and the CompCert C compiler took six. Both were written with verification in mind. Proving properties of existing production code, as an optimising compiler actually built it, is harder still. [2]

## What exactly did AlphaProof Code prove?

The team took libsignal, the reference implementation that Signal maintains, compiled it unmodified with the standard Rust compiler, and loaded the resulting ARM machine code into Lean along with a formal model of how that processor executes instructions. [2]

It then proved that the compiled code provides these properties: [2][3]

- **Forward secrecy.** Stealing a device’s current keys doesn’t expose messages sent earlier.
- **Post-compromise security.** After a compromise, the conversation heals once fresh keys are exchanged, as long as the attacker stays passive during that exchange.
- **Authentication and handshake secrecy.** The parties are who they claim to be, and the shared secret from the opening handshake stays secret.

These cover Signal’s post-quantum **PQXDH** handshake and its **Triple Ratchet**. The Triple Ratchet combines the classic Double Ratchet with the Sparse Post-Quantum Ratchet (SPQR) that Signal introduced in October 2025. [2][3]

To check that the specifications actually catch mistakes, the team reintroduced two real, previously fixed libsignal bugs. In both cases Lean proved that the buggy binaries violated the security theorems. [1][2]

## How the AI and the humans split the work

AlphaProof Code divides the job “the way a research team would”, in DeepMind’s words. [1]

1. **Humans decide what to prove.** Researchers worked with a mix of models to turn Signal’s security goals into formal specifications, and human experts reviewed every one. [1]
2. **Agents write the proofs.** Prover agents generated the millions of lines of Lean. Their output is untrusted by design: Lean’s kernel rejects any proof with a logical error, so a wrong proof can’t get through. [1][2]
3. **Agents flag what humans should check.** DeepMind says the agents marked about one percent of the codebase for a second human look. [1]

The paper says the proof work was done “by a team of five over four weeks”, each person running agents non-stop on their own workstation. [2] DeepMind contrasts this with work that “historically takes expert teams years”. [1]

## What the proofs don’t cover

The paper is unusually explicit about limits, and they matter for anyone reading the headline. [2]

- **One-to-one chats only.** Group messaging, sealed sender and server-side protocols are left for future work.
- **The cryptography itself is assumed.** The symbolic proofs “assume perfect cryptography”, and low-level cryptographic routines are trusted to meet their contracts.
- **No quantum attacker in the computational proof.** The bounds “give no guarantee against a quantum adversary”. The ratchet theorems show the Triple Ratchet is no weaker than the Double Ratchet, not the extra post-quantum protection SPQR adds.
- **Side channels are out of scope.** So are secrets elsewhere in memory.
- **A simplified setting.** The machine model doesn’t cover threads, signals or dynamic linking, and the test harness fixes two honest parties with pinned identity keys.
- **26,000 trusted lines.** The result is only as good as those specifications and the ARM model. The authors say specifications “will take many rounds of open review and refinement to settle”.

## Is this really a first?

It depends on what you count. Signal already uses formal methods. Its October 2025 post says it modelled post-quantum ratchet candidates in ProVerif, and it translates its Rust code into F* “on every CI run” to prove core parts correct and the crate panic-free. [3]

DeepMind’s claim is narrower: the first proofs that link protocol-level security goals all the way down to the **unmodified, compiled** code of a widely deployed protocol. [2] That gap between a protocol’s design and its actual implementation is where many real vulnerabilities hide, DeepMind argues. [1]

## What this means for…

**Signal users.** Nothing changes in the app. The work adds machine-checked evidence that the core one-to-one encryption code does what its designers intended, within the stated assumptions. DeepMind says the protocol also protects conversations in Google Messages. [1]

**Software and security teams.** The bottleneck is shifting. Proofs are becoming cheap, but writing the right specification is still hard; the paper calls the specification of a nontrivial system “itself a nontrivial software artifact”. [2] Teams that want this kind of assurance will need people who can say precisely what “secure” means for their code.

**India’s digital infrastructure.** Payment, identity and government systems run on cryptographic code where one flaw can affect millions of people. DeepMind suggests the same approach could reach medical-device firmware and power-grid software, but says scaling it “requires continued research”. [1]

**AI and security more broadly.** DeepMind frames verification as a defence against AI-driven attacks. It pairs the work with its automated bug-fixing agent, CodeMender. [1] For background on the model behind the agents, see our explainer on [Gemini 4 Carbon’s gated release](/article/gated-frontier-models-gemini-4-carbon/). For how agentic systems plan and use tools, see [what an AI agent is](/article/what-is-an-ai-agent/).

## What we don’t know yet

- **Independent review.** The proofs are open, but as of 12 November we found no published independent review of the 26,000 trusted lines. The authors expect several rounds of open review. [2]
- **Compute cost.** The paper notes that much of the proof deals with registers and memory layout and is costly to compute, but the blog post doesn’t give a figure. [1][2]
- **Ongoing use.** DeepMind says it is “keen” to verify new libsignal releases before they ship. Neither company has announced a schedule. [2]
- **Wider scope.** Extending to group chats and the server is listed as future work. [2]

## FAQ

### What is AlphaProof Code?

A multi-agent AI framework from Google DeepMind for formal software verification. Humans and AI agents write a specification of what code must do, then prover agents generate proofs in Lean that the code meets it. Every proof is checked by Lean’s kernel. [1][2]

### Did Google DeepMind prove Signal is unhackable?

No. It proved that libsignal’s compiled code provides specific security properties for one-to-one sessions, under stated assumptions. It assumes the cryptographic primitives are secure, excludes side channels, and doesn’t cover a quantum attacker or group chats. [2]

### How many lines of proof did the AI write?

About 6.5 million lines of machine-checked Lean, according to the technical paper. A summary on DeepMind’s blog page cites three million, but the paper and the post’s own text give the higher figure. [1][2]

### What is Lean?

A programming language and proof assistant for writing mathematical proofs that a computer checks. DeepMind describes it as “a computer language that mathematically proves the accuracy of code”. [1]

### Can I see the proofs?

Yes. DeepMind is open-sourcing its Lean specifications and proofs, and the paper links to them. [1][2]

## Sources

**Primary**

1. Google DeepMind, *Introducing AlphaProof Code: a breakthrough in verifying complex software at depth* (Pushmeet Kohli and Swarat Chaudhuri), 10 November 2026. https://deepmind.google/blog/introducing-alphaproof-code/
2. Chaudhuri, Ferraiuolo, Kovsharov, Chajed, Schlesinger, Seth, Katz, Sutton and Kohli, *AlphaProof Code: Verifying Signal’s Security at the Machine-Code Level*, Google DeepMind technical paper, 10 November 2026. https://deepmind.google/documents/36/Formal_Verification_of_Signal_4.pdf (HTML version and Lean code: https://google-deepmind.github.io/code-verification/)
3. Signal (Rolfe Schmidt), *Signal Protocol and Post-Quantum Ratchets*, 2 October 2025. https://signal.org/blog/spqr/

## Methodology note

Research and drafting for this article were AI-assisted, and every figure and quote was checked against the sources above on 12 November 2026, including the full technical paper. Where DeepMind’s blog page and paper differ (the line count), we use the paper and say so. We did not run or review the proofs ourselves. See our [editorial policy](/editorial-policy/).
