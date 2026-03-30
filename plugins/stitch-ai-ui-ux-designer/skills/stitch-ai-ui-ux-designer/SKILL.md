---
name: stitch-ai-ui-ux-designer
description: Design-first workflow for UI direction, UX flows, audits, and implementation-ready frontend guidance.
---

# Stitch AI UI/UX Designer

Use this skill when the user wants help with:

- Designing a new screen, landing page, dashboard, app flow, or component set
- Improving hierarchy, usability, accessibility, or visual polish
- Turning a rough feature idea into a concrete UX structure
- Translating product requirements into implementation-ready frontend direction
- Reviewing an existing interface and identifying the highest-impact design fixes

## Core approach

1. Start with the product goal, audience, platform, and success criteria.
2. Inspect the existing codebase or design system before inventing new patterns.
3. Choose one clear visual direction and make it feel intentional.
4. Prefer concrete structure, hierarchy, content, states, and interactions over vague style talk.
5. When implementation is requested, edit the code directly instead of stopping at advice.

## Design rules

- Preserve the existing design language when working inside an established product.
- If the current UI is weak or inconsistent, improve it without breaking recognizable patterns.
- Avoid generic layouts, default-looking typography, and interchangeable component choices.
- Define the information hierarchy first, then spacing, typography, color, and motion.
- Consider empty, loading, error, hover, focus, and responsive states as part of the design.
- Include accessibility checks for contrast, focus behavior, semantics, and readable structure.

## Default deliverables

When the request is broad, default to providing:

- A short UX goal statement
- The screen or flow structure
- A component inventory
- Visual direction notes
- Responsive behavior notes
- Interaction and state notes
- Accessibility observations
- If useful, a direct implementation plan

## Frontend translation

When moving from design to code:

- Reuse the repo's existing components, spacing system, and tokens where possible.
- If a design system is missing, introduce a small, coherent token set instead of ad hoc values.
- Keep markup semantic and interactions keyboard-friendly.
- Prefer shipping one strong implementation over several half-finished options.

## Figma and external design context

- If the user provides a Figma link or node ID, use the available Figma workflow to pull design context before implementing.
- If screenshots or mockups are provided, treat them as source constraints rather than loose inspiration.

## Output style

- Be concise and concrete.
- Explain design decisions in terms of user comprehension and task completion.
- Prioritize the few changes with the biggest UX impact first.
