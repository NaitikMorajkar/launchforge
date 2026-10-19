/**
 * Interactive component tests for the demo gallery and the sandboxed preview
 * modal (plus the project-modal local-preview routing).
 *
 * Mounts the REAL components into jsdom and simulates clicks, verifying that:
 *   - every demo card can open a preview inside the app,
 *   - previews are local `/demos/*.html` pages in an isolated sandbox,
 *   - the loading state is a real frame load (skeleton disappears on load),
 *   - the modal close control and closed state behave,
 *   - sample project cards route "Live Preview" to the in-app host instead of
 *     navigating away, with sample discussion clearly labelled.
 *
 * Run: npm test
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

// Expose browser globals BEFORE React modules load.
const g = globalThis as any;
const globalKeys = [
  'window', 'document', 'navigator', 'HTMLElement', 'HTMLIFrameElement',
  'HTMLInputElement', 'HTMLButtonElement', 'Element', 'Node', 'SVGElement',
  'MouseEvent', 'Event', 'CustomEvent', 'KeyboardEvent', 'MutationObserver',
  'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame',
  'ResizeObserver',
];
for (const key of globalKeys) {
  const value = (dom.window as any)[key];
  if (value === undefined) continue;
  const bound =
    typeof value === 'function' && key !== 'ResizeObserver'
      ? value.bind(dom.window)
      : value;
  try {
    // Node >=21 exposes some globals (e.g. navigator) as getter-only —
    // redefine them so React sees the jsdom environment.
    Object.defineProperty(g, key, { value: bound, writable: true, configurable: true });
  } catch {
    try {
      g[key] = bound;
    } catch {
      /* keep Node's native global */
    }
  }
}
g.IS_REACT_ACT_ENVIRONMENT = true;

let pass = 0;
let fail = 0;
const results: string[] = [];

function assert(name: string, cond: boolean, detail = '') {
  if (cond) {
    pass += 1;
    results.push(`PASS  ${name}${detail ? ' — ' + detail : ''}`);
  } else {
    fail += 1;
    results.push(`FAIL  ${name}${detail ? ' — ' + detail : ''}`);
  }
}

const click = async (act: any, el: Element | null | undefined) => {
  if (!el) throw new Error('click target missing');
  await act(async () => {
    el.dispatchEvent(
      new dom.window.MouseEvent('click', { bubbles: true, cancelable: true })
    );
  });
};

async function main() {
  const React = await import('react');
  const { act } = React;
  const { createRoot } = await import('react-dom/client');
  const { DemoGallery } = await import('../src/components/DemoGallery');
  const { DemoPreviewModal } = await import('../src/components/DemoPreviewModal');

  const container: HTMLElement = dom.window.document.createElement('div');
  dom.window.document.body.appendChild(container);
  const root = createRoot(container);

  /* ------------------------- DemoGallery ------------------------- */
  const opened: { src: string; title: string }[] = [];
  await act(async () => {
    root.render(
      React.createElement(DemoGallery, {
        onPreview: (d: any) => opened.push({ src: d.src, title: d.name }),
        theme: 'dark',
      })
    );
  });

  assert('gallery: renders 8 demo cards', container.querySelectorAll('article').length === 8,
    `${container.querySelectorAll('article').length} cards`);
  assert('gallery: section id="demos" exists for navbar link', container.querySelector('section#demos') !== null);

  const previewBtns = Array.from(container.querySelectorAll('button')).filter((b) =>
    /Live Preview/.test(b.textContent || '')
  );
  assert('gallery: every card has a Live Preview button', previewBtns.length === 8,
    `${previewBtns.length} buttons`);

  for (const btn of previewBtns) await click(act, btn);
  assert('gallery: all 8 Live Preview clicks route in-app', opened.length === 8, `${opened.length} opens`);
  assert('gallery: previews are local /demos paths',
    opened.every((o) => /^\/demos\/[\w-]+\.html$/.test(o.src)), opened[0]?.src || 'none');
  assert('gallery: 8 distinct demo pages', new Set(opened.map((o) => o.src)).size === 8,
    `${new Set(opened.map((o) => o.src)).size} distinct`);

  const detailsBtns = Array.from(container.querySelectorAll('button[aria-expanded]'));
  assert('gallery: every card has a View Details toggle', detailsBtns.length === 8,
    `${detailsBtns.length} toggles`);
  const firstToggle = detailsBtns[0];
  assert('gallery: details start collapsed', firstToggle.getAttribute('aria-expanded') === 'false');
  await click(act, firstToggle);
  assert('gallery: details expand on click', firstToggle.getAttribute('aria-expanded') === 'true');
  await click(act, firstToggle);
  assert('gallery: details collapse on second click', firstToggle.getAttribute('aria-expanded') === 'false');

  assert('gallery: cards are labelled Demo', /Demo/.test(container.textContent || ''));

  /* ----------------------- DemoPreviewModal ---------------------- */
  const closed: number[] = [];
  await act(async () => {
    root.render(
      React.createElement(DemoPreviewModal, {
        src: '/demos/saas.html',
        title: 'SaaS Landing Page',
        subtitle: 'SaaS demo',
        onClose: () => closed.push(1),
        theme: 'dark',
      })
    );
  });

  const iframe = container.querySelector('iframe');
  assert('modal: iframe opens for the demo', iframe !== null);
  assert('modal: iframe src is the local demo page',
    iframe?.getAttribute('src') === '/demos/saas.html', iframe?.getAttribute('src') || 'missing');
  const sandbox = iframe?.getAttribute('sandbox') || '';
  assert('modal: sandbox allows scripts (demos stay interactive)', sandbox.includes('allow-scripts'), sandbox);
  assert('modal: sandbox withholds allow-same-origin (parent stays isolated)',
    !sandbox.includes('allow-same-origin'), sandbox);
  assert('modal: shows the demo title', /SaaS Landing Page/.test(container.textContent || ''));
  assert('modal: shows loading state before the real frame load',
    /Loading interactive preview/.test(container.textContent || ''));
  assert('modal: source path visible in toolbar', /\/demos\/saas\.html/.test(container.textContent || ''));

  // Simulate the genuine iframe load event → skeleton must clear.
  await act(async () => {
    iframe!.dispatchEvent(new dom.window.Event('load', { bubbles: true }));
  });
  assert('modal: skeleton clears on real load event (no fake spinner)',
    !/Loading interactive preview/.test(container.textContent || ''));

  const reloadBtn = container.querySelector('button[aria-label="Reload preview"]');
  assert('modal: reload control present', reloadBtn !== null);
  await click(act, reloadBtn);
  assert('modal: reload restarts the frame in loading state',
    /Loading interactive preview/.test(container.textContent || ''));

  const closeBtn = container.querySelector('button[aria-label="Close preview"]');
  assert('modal: close control present', closeBtn !== null);
  await click(act, closeBtn);
  assert('modal: close control calls onClose', closed.length === 1, `${closed.length} calls`);

  await act(async () => {
    root.render(
      React.createElement(DemoPreviewModal, {
        src: null, title: '', onClose: () => {}, theme: 'dark',
      })
    );
  });
  assert('modal: closed state renders nothing (src=null)', container.querySelector('iframe') === null);

  /* ----------------- ProjectModal local preview ------------------ */
  try {
    const { ProjectModal } = await import('../src/components/ProjectModal');
    const { INITIAL_PROJECTS } = await import('../src/data/mockProjects');

    const sample = INITIAL_PROJECTS.find((p) => p.isSample && p.demoUrl);
    assert('project modal: sample project ships a local demoUrl',
      Boolean(sample && /^\/demos\/.+\.html$/.test(sample.demoUrl!)), sample?.demoUrl || 'none');

    const container2: HTMLElement = dom.window.document.createElement('div');
    dom.window.document.body.appendChild(container2);
    const root2 = createRoot(container2);
    const opens: string[] = [];

    await act(async () => {
      root2.render(
        React.createElement(ProjectModal as any, {
          project: sample,
          onClose: () => {},
          onToggleLike: () => {},
          currentUser: null,
          onRequireAuth: () => false,
          onOpenDemoPreview: (src: string, title: string) => opens.push(`${src}|${title}`),
          theme: 'dark',
        })
      );
    });

    assert('project modal: sample badge displayed', /Sample showcase/.test(container2.textContent || ''));
    assert('project modal: discussion labelled as sample content',
      /Sample Discussion/.test(container2.textContent || '') &&
      /not real user comments/.test(container2.textContent || ''));
    assert('project modal: sample composer is read-only',
      container2.querySelector('form') === null && /read-only/.test(container2.textContent || ''));

    const liveBtn = Array.from(container2.querySelectorAll('button')).find((b) =>
      /Live Preview/.test(b.textContent || '')
    );
    assert('project modal: Live Preview button present for local demo', Boolean(liveBtn));
    await click(act, liveBtn);
    assert('project modal: Live Preview opens inside the app (no navigation away)',
      opens.length === 1 && opens[0].startsWith('/demos/'), opens[0] || 'not called');

    await act(async () => root2.unmount());
  } catch (e) {
    assert('project modal: mounts for testing', false, String(e));
  }

  /* -------------------------- SetupModal -------------------------- */
  try {
    const { SetupModal } = await import('../src/components/SetupModal');
    const container3: HTMLElement = dom.window.document.createElement('div');
    dom.window.document.body.appendChild(container3);
    const root3 = createRoot(container3);

    await act(async () => {
      root3.render(
        React.createElement(SetupModal, { isOpen: false, onClose: () => {}, theme: 'dark' })
      );
    });
    assert('setup modal: closed state renders nothing', container3.innerHTML === '');

    const setupCloses: number[] = [];
    await act(async () => {
      root3.render(
        React.createElement(SetupModal, {
          isOpen: true, onClose: () => setupCloses.push(1), theme: 'dark',
        })
      );
    });
    assert('setup modal: shows exactly 4 setup steps',
      container3.querySelectorAll('ol > li').length === 4,
      `${container3.querySelectorAll('ol > li').length} steps`);
    assert('setup modal: shows copyable env snippet with placeholders',
      /VITE_SUPABASE_URL="https:\/\/YOUR-PROJECT-REF/.test(container3.textContent || ''));
    assert('setup modal: explains why the app is in demo mode',
      /demo mode/.test(container3.textContent || ''));
    assert('setup modal: links to the Supabase dashboard',
      Array.from(container3.querySelectorAll('a')).some((a) =>
        /supabase\.com\/dashboard/.test(a.getAttribute('href') || '')));
    assert('setup modal: mentions the schema file to run',
      /0001_init\.sql/.test(container3.textContent || ''));

    await click(act, container3.querySelector('button[aria-label="Close setup guide"]'));
    assert('setup modal: close control calls onClose', setupCloses.length === 1,
      `${setupCloses.length} calls`);

    await act(async () => root3.unmount());
    container3.remove();
  } catch (e) {
    assert('setup modal: mounts for testing', false, String(e));
  }

  await act(async () => root.unmount());
}

main()
  .then(() => {
    for (const line of results) console.log(line);
    console.log(`\n=== component tests: ${pass}/${pass + fail} passed, ${fail} failed ===`);
    process.exit(fail ? 1 : 0);
  })
  .catch((e) => {
    for (const line of results) console.log(line);
    console.error('\nTEST HARNESS ERROR:', e);
    process.exit(2);
  });
