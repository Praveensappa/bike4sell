# Test Strategy - Bike4Sell

## Scope
- In-scope: Web UI functional + non-functional basic checks across all 8 modules in Chrome.
- Out-of-scope: API-only testing, security testing, load/performance tooling.

## Approach
- Manual functional validation first, then automate critical E2E flows in Playwright.
- Apply test design techniques: Equivalence Partitioning, Boundary Value Analysis, Decision Tables.
- Validate core business rules and UI states (loading/error/empty).

## Tools
- Test management: Markdown tracker sheets in repository.
- Automation: Playwright JS with POM.
- Defect tracking: defect report and lifecycle tracker docs.

## Risks
- Environment instability (DB seed mismatch).
- Dynamic test data causing flaky UI assertions.
- Payment simulation and order status race conditions.
