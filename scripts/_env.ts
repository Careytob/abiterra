// scripts/_env.ts
// Imported FIRST by scripts that read process.env at import time (e.g. lib/site-config).
// ES module imports are hoisted, so env must be loaded in its own module.
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();
