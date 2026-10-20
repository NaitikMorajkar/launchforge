/**
 * LaunchForge setup checker.
 *
 * Run: npm run setup:check
 *
 * Validates that Supabase is wired up correctly:
 *   1. `.env.local` / `.env` exist and contain VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *   2. The values are well-formed (URL shape, key length)
 *   3. The project is reachable (auth health endpoint)
 *   4. The database schema from supabase/migrations/0001_init.sql is applied
 *      (the `projects` table answers an authenticated REST query)
 *
 * Secrets are NEVER printed — values are shown masked (prefix + length only).
 * Exit code 0 = configured & verified, 1 = needs attention.
 */
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mask = (v) =>
  !v ? '(not set)' : `${v.slice(0, 10)}… (${v.length} chars)`;

function readEnvFile(file) {
  const full = path.join(root, file);
  if (!existsSync(full)) return null;
  const out = {};
  for (const line of readFileSync(full, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

(async () => {
  console.log('LaunchForge · Supabase setup check\n' + '─'.repeat(46));

  // 1. Env file presence
  const envLocal = readEnvFile('.env.local');
  const envFile = readEnvFile('.env');
  const env = { ...(envFile || {}), ...(envLocal || {}) };
  const source = envLocal ? '.env.local' : envFile ? '.env' : null;

  if (!source) {
    console.error('✗ No .env.local or .env file found.');
    console.error('\n  Fix: copy .env.example to .env.local and fill in your');
    console.error('  Supabase Project URL + anon key, then re-run this check.');
    process.exit(1);
  }
  console.log(`✓ Env file found: ${source}`);

  // 2. Value presence & shape
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  let ok = true;

  // Detect the untouched template text first — it is the single most common
  // reason checks fail right after copying .env.example.
  const isPlaceholderUrl = /YOUR-PROJECT-REF/i.test(url || '');
  const isPlaceholderKey = /YOUR-PUBLIC-ANON-KEY/i.test(key || '');

  if (!url) {
    console.error('✗ VITE_SUPABASE_URL is missing.');
    ok = false;
  } else if (isPlaceholderUrl) {
    console.error('✗ VITE_SUPABASE_URL still contains the .env.example placeholder.');
    console.error('  Replace it with your real Project URL from');
    console.error('  Dashboard → Settings → API → Project URL, e.g.');
    console.error('  VITE_SUPABASE_URL="https://abcdefgh.supabase.co"');
    ok = false;
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)\/?$/i.test(url)) {
    console.error(`✗ VITE_SUPABASE_URL looks wrong: ${mask(url)}`);
    console.error('  Expected: https://YOUR-PROJECT-REF.supabase.co');
    ok = false;
  } else {
    console.log(`✓ VITE_SUPABASE_URL       ${mask(url)}`);
  }

  if (!key) {
    console.error('✗ VITE_SUPABASE_ANON_KEY is missing.');
    ok = false;
  } else if (isPlaceholderKey) {
    console.error('✗ VITE_SUPABASE_ANON_KEY still contains the .env.example placeholder.');
    console.error('  Replace it with the "anon public" key from');
    console.error('  Dashboard → Settings → API (the long value starting with eyJ…).');
    ok = false;
  } else if (key.length < 40 || !key.startsWith('eyJ')) {
    console.error(`✗ VITE_SUPABASE_ANON_KEY looks wrong: ${mask(key)}`);
    console.error('  Expected the "anon public" JWT from Settings → API (starts with eyJ).');
    ok = false;
  } else {
    console.log(`✓ VITE_SUPABASE_ANON_KEY  ${mask(key)}`);
  }

  if (!ok) {
    console.error('\n  Edit: ' + source + '  →  fill in both values → save, then re-run.');
    console.error('  (Dashboard → Settings (gear) → API has both values.)');
    process.exit(1);
  }

  // 3. Reachability (auth health — no secret involved)
  const base = url.replace(/\/$/, '');
  try {
    const health = await fetch(`${base}/auth/v1/health`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(10000),
    });
    if (!health.ok) {
      console.error(`✗ Project unreachable or bad key (auth health → HTTP ${health.status}).`);
      console.error('  Check the Project URL and that you copied the ANON key (not service_role).');
      process.exit(1);
    }
    console.log('✓ Project reachable (auth service healthy)');
  } catch (e) {
    console.error(`✗ Could not reach ${base}: ${e.message}`);
    console.error('  Check your network / VPN and the project URL.');
    process.exit(1);
  }

  // 4. Schema applied? (RLS-safe read of the projects table with anon key)
  try {
    const rest = await fetch(`${base}/rest/v1/projects?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(10000),
    });
    if (rest.ok) {
      console.log('✓ Schema applied — `projects` table answers queries (RLS allows public reads)');
      console.log('\n✅ Supabase is fully wired. Restart `npm run dev` if the app tab is');
      console.log('   already open — the amber demo-mode banner will disappear and');
      console.log('   sign-in / Start Project / upvotes will go live.');
      process.exit(0);
    }
    if (rest.status === 401 || rest.status === 403) {
      console.error(`✗ API rejected the key (HTTP ${rest.status}).`);
      console.error('  Make sure you used the anon PUBLIC key, not the service_role key.');
      process.exit(1);
    }
    console.error(`✗ Querying \`projects\` failed (HTTP ${rest.status}).`);
    console.error('  Most likely the schema was not applied yet: open the SQL Editor');
    console.error('  and run the contents of supabase/migrations/0001_init.sql, then re-run.');
    process.exit(1);
  } catch (e) {
    console.error(`✗ Schema check failed: ${e.message}`);
    process.exit(1);
  }
})();
