---
title: "What Is MCP (Model Context Protocol)? A Plain-English Guide for 2026"
seoTitle: "What Is MCP? Model Context Protocol Explained"
description: "MCP is the open standard that lets AI assistants such as Claude and ChatGPT connect to files, apps and tools. How it works, what changed in the 2026 spec, and how to use it safely."
category: "models"
image: "/images/articles/what-is-mcp-model-context-protocol/hero.jpg"
imageAlt: "What Is MCP (Model Context Protocol)? A Plain-English Guide for 2026"
tags: ["MCP", "AI agents", "Explainer"]
date: "2026-11-19T07:30:00Z"
takeaways:
  - "MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external data, tools and workflows; its own docs call it “a USB-C port for AI applications”."
  - "Anthropic open-sourced MCP on 25 November 2024. AI assistants such as Claude and ChatGPT, and developer tools such as VS Code and Cursor, now support it."
  - "An MCP host such as Claude Code creates one MCP client per server; servers offer three main things: resources (data), prompts (templates) and tools (actions)."
  - "The latest specification, dated 28 July 2026, makes the protocol stateless: it drops the opening handshake and protocol-level sessions."
  - "The spec says there should always be a human able to deny tool calls, and treats tools as arbitrary code execution. Install only servers you trust."
---
## The bottom line

**MCP, the Model Context Protocol, is an open standard that lets an AI assistant plug into the places where your information and tools live**: files, databases, calendars, code repositories and business apps. Instead of every AI product building a custom connector for every service, a service builds one MCP server, and any AI application that speaks MCP can use it. [1][2]

The project’s own documentation puts it simply: “Think of MCP like a USB-C port for AI applications.” [2] Anthropic released it as open source in November 2024. It is now supported by AI assistants such as Claude and ChatGPT and by developer tools such as Visual Studio Code and Cursor. [1][2]

MCP doesn’t make a model smarter. It gives the model a standard way to read context and take actions, which is why it sits at the heart of today’s [AI agents](/article/what-is-an-ai-agent/). That power is also the risk: the specification treats tools as arbitrary code execution, and says a human should always be able to say no. [3][4]

## Key facts at a glance

| | |
|---|---|
| Full name | Model Context Protocol (MCP) |
| What it is | An open-source standard for connecting AI applications to external systems [2] |
| Launched | Open-sourced by Anthropic on 25 November 2024 [1] |
| Created by | David Soria Parra and Justin Spahr-Summers at Anthropic [1] |
| Message format | JSON-RPC 2.0 [3] |
| Transports | stdio (local) and Streamable HTTP (remote) [5] |
| Latest spec version | 2026-07-28 [3] |
| Earlier versions | 2024-11-05, 2025-03-26, 2025-06-18, 2025-11-25 [3] |
| Supported by (examples) | Claude, ChatGPT, Visual Studio Code, Cursor [2] |

## What problem does MCP solve?

Before MCP, connecting an AI assistant to a new data source meant writing a one-off integration. Anthropic’s launch post described models as “trapped behind information silos and legacy systems”, where “every new data source requires its own custom implementation”. [1]

MCP replaces that with one protocol. Anthropic’s framing was “replacing fragmented integrations with a single protocol”. [1] The specification says MCP borrows the idea from the Language Server Protocol, which did the same job for programming languages in code editors: build support once, and it works across many tools. [3]

The project’s documentation lists the kinds of things this enables: an agent that reads your Google Calendar and Notion, Claude Code building a web app from a Figma design, and an enterprise chatbot querying several company databases through chat. [2]

## How MCP works: hosts, clients and servers

MCP has three roles. [3][6]

- **Host:** the AI application you use, such as Claude Desktop, Claude Code or Visual Studio Code.
- **Client:** a connector inside the host. The host creates **one client for each server** it connects to, and each client keeps a dedicated connection with its server. [6]
- **Server:** a program that offers context and capabilities, such as access to a filesystem, a database, GitHub or Sentry.

Servers can run in two places. A **local** server runs on your own machine and talks to the host over standard input and output (stdio); it typically serves a single client. A **remote** server runs elsewhere and uses **Streamable HTTP**; it typically serves many clients. [5][6] For remote servers, MCP recommends OAuth to obtain authentication tokens. [6]

All messages use the JSON-RPC 2.0 format. [3]

### What a server can offer

The specification defines three server features: [3]

| Feature | What it is | Example |
|---|---|---|
| **Resources** | Context and data, for the user or the AI model to use | A file, a database schema, a document |
| **Prompts** | Templated messages and workflows for users | A “summarise this pull request” template |
| **Tools** | Functions the AI model can execute | Create a calendar event, run a query, open an issue |

Tools are what turn a chatbot into an agent: the model decides when to call one, and the host runs it. Clients can also offer **elicitation** back to servers, a way for a server to ask the user for more information mid-task. [3]

## What changed in the 2026 specification?

MCP is versioned by date. The current version, **2026-07-28**, made the biggest structural change since launch. [3][7]

- **It is now stateless.** The opening `initialize` handshake is gone. Every request carries its own protocol version and client capabilities. [7]
- **No protocol-level sessions.** The `Mcp-Session-Id` header was removed from Streamable HTTP. Servers that need to remember state across calls hand out explicit handles as ordinary tool arguments. [7]
- **A new discovery call.** Servers must implement `server/discover` to advertise their supported versions, capabilities and identity. [7]
- **Multi round-trip requests.** When a server needs more input, it returns an “input required” result, and the client retries with the answers. This replaces requests that servers used to send to clients. [7]
- **Deprecations.** The Roots, Sampling and Logging features still work, but are deprecated, and new implementations should not add them. [7]
- **Long-running tasks moved out of the core** into an official, opt-in extension. [7]

For most users these changes are invisible. For developers they mean simpler hosting, because a stateless server is easier to run behind ordinary web infrastructure, and some migration work for older servers.

## Is MCP safe?

MCP is a pipe. It is as safe as the servers you connect and the permissions you grant. The specification is blunt about this. [3][4]

- **Tools are code execution.** “Tools represent arbitrary code execution and must be treated with appropriate caution.” Descriptions of what a tool does “should be considered untrusted, unless obtained from a trusted server.” [3]
- **Consent comes first.** Hosts must get explicit user consent before invoking any tool and before exposing user data to servers. [3]
- **A human should be able to say no.** “There **SHOULD** always be a human in the loop with the ability to deny tool invocations.” [4]
- **The protocol can’t enforce this.** The spec says MCP “cannot enforce these security principles at the protocol level”; that falls to the applications that implement it. [3]

The project’s security guide spells out real attack patterns. A malicious local server can hide a harmful command in its startup configuration, such as one that uploads your SSH keys. An insecure server left running on your computer can be reached by other software. And a token granted with broad scopes such as `files:*` or `admin:*` turns one leak into wide access. [8]

The practical rules:

1. **Install servers only from sources you trust**, and read the command a server runs before you add it.
2. **Grant the narrowest permissions that work**, and avoid tokens with sweeping scopes. [8]
3. **Keep confirmation prompts on** for anything that writes, sends, deletes or spends.
4. **Be wary of content the model reads.** A web page or document can contain instructions aimed at the model. Treat tool output as data, not commands.

## What this means for…

**Everyday users.** If your AI assistant offers “connectors”, “integrations” or “MCP servers”, this is the plumbing underneath. Connect only what you need, and read the permission prompt each time.

**Developers.** One MCP server reaches many AI apps, so it is usually the cheapest way to make your product usable by assistants. Target the 2026-07-28 spec for new work, and skip the deprecated features. [7] If you are deciding how much context to send a model at all, our guide to [context windows, memory and RAG](/article/context-window-vs-memory-vs-rag/) covers the trade-offs.

**Businesses, including in India.** MCP lets internal assistants reach company systems without a custom integration per vendor. But the security model depends on your own controls: scoped tokens, approved server lists and logging. For a sense of how quickly agents are entering software work, see our look at [GitHub’s Octoverse 2026 figures](/article/github-octoverse-2026-agents-pull-requests/).

## What we don’t know yet

- **How fast the ecosystem moves to the stateless spec.** Older servers and clients will coexist with 2026-07-28 for some time, and the spec includes backward-compatibility probes for that reason. [7]
- **Whether deprecated features are removed on schedule.** Roots, Sampling and Logging are deprecated, but no removal version is listed in the changelog. [7]
- **How well hosts implement consent.** The spec relies on applications to build good permission prompts, and quality will vary. [3]

## FAQ

### What does MCP stand for in AI?

Model Context Protocol. It is an open-source standard for connecting AI applications to external data sources, tools and workflows. [2]

### Who created MCP?

Anthropic open-sourced it on 25 November 2024. The launch post credits David Soria Parra and Justin Spahr-Summers with creating it. [1]

### Does ChatGPT support MCP?

Yes. The MCP documentation lists ChatGPT alongside Claude, Visual Studio Code and Cursor as applications that support it. [2]

### What is the difference between an MCP server and an MCP client?

A server offers data, prompts or tools, such as access to GitHub. A client is the connector inside an AI application that talks to one server. An application creates one client for each server it connects to. [6]

### Is MCP an API?

Not exactly. An API is one service’s interface. MCP is a common protocol that sits in front of many services, so an AI application can use any of them the same way. A server often wraps an existing API. [1][3]

### Is it safe to install MCP servers?

Only from sources you trust. Local servers run on your machine with your permissions, and the official security guide describes servers being used to steal data or run harmful commands. [8]

## Sources

**Primary**

1. Anthropic, *Introducing the Model Context Protocol*, 25 November 2024. https://www.anthropic.com/news/model-context-protocol
2. Model Context Protocol, *What is the Model Context Protocol (MCP)?* (docs, version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro
3. Model Context Protocol, *Specification* (version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/specification/2026-07-28
4. Model Context Protocol, *Specification: Tools* (version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/specification/2026-07-28/server/tools
5. Model Context Protocol, *Specification: Transports* (version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/index
6. Model Context Protocol, *Architecture overview* (docs, version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
7. Model Context Protocol, *Key Changes* (changelog for version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/specification/2026-07-28/changelog
8. Model Context Protocol, *Security Best Practices* (docs, version 2026-07-28), accessed 11 November 2026. https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices

## Methodology note

Research and drafting for this explainer were AI-assisted, and every factual statement was checked against the sources above on 11 November 2026. Specification details refer to MCP version 2026-07-28; earlier versions differ. See our [editorial policy](/editorial-policy/).
