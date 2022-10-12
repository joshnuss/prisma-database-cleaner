prisma-database-cleaner
-----------------------

Utility for cleaning your Prisma database between test runs.

Extracted from [Sky Cart](https://github.com/joshnuss/sky-cart)

## Setup

```sh
pnpm install -D prisma-database-cleaner
```

## Usage

Call `truncateAll()` before each test run.

```javascript
import { truncateAll } from 'prisma-database-cleaner'

beforeEach(truncateAll)
```

## License

MIT
