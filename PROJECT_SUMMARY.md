# Project Changes Brief

## Overview

This project was completed by implementing the missing product management feature, improving data retrieval performance for large responses, enforcing business and validation rules, standardizing error handling, and adding unit tests for core modules.

## Main functional changes

- Added full Products API endpoints:
  - create product
  - list all products with optional case-insensitive name search
  - get product by ID
  - update product
  - delete product
- Added validation in product flows to ensure a product is always linked to an existing shop.

## Pagination and performance improvements

- Members listing now supports pagination (`limit`, `offset`) to avoid returning very large arrays.
- Shops with products endpoint now uses eager loading to avoid N+1 queries.
- Shops with products endpoint also supports pagination (`limit`, `offset`) for scalable responses.

## Business rules and correctness

- Enforced family-link constraints for members:
  - member cannot reference itself as central member
  - central member must exist
  - a family member cannot become a central member for others
- Added not-found and bad-request handling in services to prevent invalid states and return meaningful API errors.

## Error handling standardization

- Added and registered a global exception filter to return a consistent error response shape.
- Added a shared error response DTO for predictable error payloads.

## Testing changes

- Added controller and service unit tests for:
  - members
  - products
  - shops
- Added realistic test fixture factories per module.
- Test coverage includes happy paths and real failure scenarios (not found, invalid linkage, invalid update/create flows).
- Jest alias mapping was configured so test runtime resolves `src/...` imports consistently.

## Current status

- Build and tests are passing with the implemented changes.
