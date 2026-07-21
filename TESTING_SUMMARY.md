# Testing Changes Summary

## What changed (brief)

- Added unit tests for controllers and services in `members`, `products`, and `shops` modules.
- Added realistic test fixtures/factories for each module:
  - `src/modules/members/factories/member.factory.ts`
  - `src/modules/products/factories/product.factory.ts`
  - `src/modules/shops/factories/shop.factory.ts`
- Added Jest alias mapping in `package.json`:
  - `moduleNameMapper: { "^src/(.*)$": "<rootDir>/$1" }`
  - This allows Jest to resolve existing `src/...` imports.
- Used Nest testing convention with `Test.createTestingModule(...)` and `useValue` mocks (`jest.fn()`).

## Test files added

- `src/modules/members/tests/members.controller.spec.ts`
- `src/modules/members/tests/members.service.spec.ts`
- `src/modules/products/tests/products.controller.spec.ts`
- `src/modules/products/tests/products.service.spec.ts`
- `src/modules/shops/tests/shops.controller.spec.ts`
- `src/modules/shops/tests/shops.service.spec.ts`

## Test cases covered (brief)

### Members
- Controller delegates `create`, `findAll` (default + custom pagination), `findOne`, `update`, and `delete`.
- Service covers success for create/find/list/update/delete.
- Service failure cases:
  - member not found (`findOne`, `update`, `delete`)
  - invalid central member reference
  - central member does not exist
  - self-reference as central member

### Products
- Controller delegates `create`, `findAll` (with/without name filter), `findOne`, `update`, and `delete`.
- Service covers success for filtered lookup, create/find/list/update/delete.
- Service failure cases:
  - product not found (`findOne`, `update`, `delete`)
  - create/update with non-existing `shopId`

### Shops
- Controller delegates `create`, `findAll`, `findAllWithProducts` (default + custom pagination), `findOne`, `update`, and `delete`.
- Service covers success for create/find/list/findAllWithProducts mapping/update/delete.
- Service failure cases:
  - shop not found (`findOne`, `update`, `delete`)

## Validation status

- Added suites were executed successfully during implementation (`npm test` and focused `--runInBand` module runs).
