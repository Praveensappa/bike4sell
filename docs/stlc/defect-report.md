# Defect Report

## BUG-001 Duplicate bike added
- Severity: High
- Priority: P1
- Steps: Login as seller -> Add same bike details twice -> submit
- Expected: Duplicate blocked
- Actual: Duplicate listing created

## BUG-002 Wrong order status shown
- Severity: Medium
- Priority: P2
- Steps: Checkout bike -> open orders tracking
- Expected: CONFIRMED then progressing statuses
- Actual: Pending status shown incorrectly

## BUG-003 Payment failure not handled
- Severity: High
- Priority: P1
- Steps: Simulate payment gateway timeout
- Expected: Graceful failure + retry message
- Actual: Generic error/no clear action

## BUG-004 Review allowed without purchase
- Severity: High
- Priority: P1
- Steps: Login with non-buyer account -> submit review
- Expected: Block review
- Actual: Review accepted
