/* LaunchForge demo gallery smoke test (jsdom).
 * Exercises every interactive control in each shipped demo page. */
const path = require('path');
const { readFileSync } = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');

// Resolve pages relative to the repo root, wherever the test is run from.
const DIR = path.resolve(__dirname, '..', 'public', 'demos');
const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

function assert(name, cond, detail = '') {
  record(name, Boolean(cond), detail);
}

async function load(file) {
  const html = readFileSync(path.join(DIR, file), 'utf8');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(String(e && e.message ? e.message : e)));
  vc.on('error', (...a) => errors.push(a.map(String).join(' ')));
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      // Browser APIs jsdom does not implement; harmless shims.
      window.Element.prototype.scrollIntoView = function () {};
      window.scrollTo = function () {};
    },
  });
  await new Promise((r) => setTimeout(r, 60));
  return { dom, errors, doc: dom.window.document, win: dom.window };
}

const fatalErrors = (errs) =>
  errs.filter((e) => !/Not implemented|Could not parse CSS|Could not load/i.test(e));

const click = (win, el) =>
  el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  /* ---------------- portfolio ---------------- */
  {
    const { dom, errors, doc, win } = await load('portfolio.html');
    assert('portfolio: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('portfolio: home view visible', !doc.getElementById('home').classList.contains('hidden'));
    click(win, doc.querySelector('#nav button[data-v="work"]'));
    assert('portfolio: Work tab switches view',
      doc.getElementById('work').classList.contains('hidden') === false &&
      doc.getElementById('home').classList.contains('hidden') === true);
    click(win, doc.querySelector('#nav button[data-v="contact"]'));
    assert('portfolio: Contact tab switches view',
      !doc.getElementById('contact').classList.contains('hidden'));
    const form = doc.querySelector('form');
    form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
    await sleep(20);
    assert('portfolio: contact form shows success toast',
      /Message sent/.test(doc.getElementById('toast').textContent));
    dom.window.close();
  }

  /* ---------------- ecommerce ---------------- */
  {
    const { dom, errors, doc, win } = await load('ecommerce.html');
    assert('ecommerce: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('ecommerce: 8 products rendered', doc.querySelectorAll('#grid .card').length === 8,
      `${doc.querySelectorAll('#grid .card').length} cards`);
    click(win, doc.querySelector('#grid .add'));
    click(win, doc.querySelectorAll('#grid .add')[1]);
    assert('ecommerce: add-to-cart updates count', doc.getElementById('count').textContent === '2',
      `count=${doc.getElementById('count').textContent}`);
    assert('ecommerce: cart line items listed', doc.querySelectorAll('#items .line').length === 2);
    click(win, doc.querySelector('#filters button[data-c="audio"]'));
    assert('ecommerce: category filter narrows grid',
      doc.querySelectorAll('#grid .card').length === 3,
      `${doc.querySelectorAll('#grid .card').length} audio products`);
    click(win, doc.querySelector('.cartbtn'));
    assert('ecommerce: cart drawer opens',
      doc.getElementById('drawer').classList.contains('open'));
    click(win, doc.querySelector('.checkout'));
    await sleep(20);
    assert('ecommerce: checkout clears cart + toast',
      doc.getElementById('count').textContent === '0' && /Order placed/.test(doc.getElementById('toast').textContent));
    assert('ecommerce: empty cart state shown', /empty/i.test(doc.getElementById('items').textContent));
    dom.window.close();
  }

  /* ---------------- saas ---------------- */
  {
    const { dom, errors, doc, win } = await load('saas.html');
    assert('saas: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('saas: 3 plans rendered', doc.querySelectorAll('#plans .plan').length === 3);
    const proMonthly = doc.querySelectorAll('#plans .price')[1].textContent;
    click(win, doc.getElementById('switch'));
    const proYearly = doc.querySelectorAll('#plans .price')[1].textContent;
    assert('saas: pricing toggle changes price',
      /\$29/.test(proMonthly) && /\$23/.test(proYearly), `${proMonthly.trim()} -> ${proYearly.trim()}`);
    assert('saas: yearly switch marked on', doc.getElementById('switch').classList.contains('on'));
    click(win, doc.querySelector('#plans .plan.hot button'));
    await sleep(20);
    assert('saas: plan CTA fires toast', /Pro plan selected/.test(doc.getElementById('toast').textContent));
    assert('saas: feature cards present', doc.querySelectorAll('.feat').length === 6);
    dom.window.close();
  }

  /* ---------------- analytics ---------------- */
  {
    const { dom, errors, doc, win } = await load('analytics.html');
    assert('analytics: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('analytics: 7 bars drawn after animation', doc.querySelectorAll('#bars .bar').length === 7);
    assert('analytics: 4 KPI cards', doc.querySelectorAll('.kpi').length === 4);
    await sleep(80);
    click(win, doc.querySelector('#range button[data-r="30"]'));
    assert('analytics: date range updates KPI', doc.getElementById('k1').textContent === '$196k',
      doc.getElementById('k1').textContent);
    click(win, doc.querySelector('#nav button[data-v="orders"]'));
    assert('analytics: sidebar switches to Orders view',
      doc.getElementById('orders').classList.contains('on') &&
      !doc.getElementById('overview').classList.contains('on') &&
      doc.getElementById('title').textContent === 'Orders');
    assert('analytics: orders table populated', doc.querySelectorAll('#orders-body tr').length === 5);
    click(win, doc.querySelector('#nav button[data-v="cust"]'));
    assert('analytics: Customers view + rows',
      doc.getElementById('cust').classList.contains('on') &&
      doc.querySelectorAll('#cust-body tr').length === 5);
    dom.window.close();
  }

  /* ---------------- chatbot ---------------- */
  {
    const { dom, errors, doc, win } = await load('chatbot.html');
    assert('chatbot: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('chatbot: greeting message rendered', doc.querySelectorAll('#chat .msg.bot').length >= 1);
    assert('chatbot: 4 quick prompts', doc.querySelectorAll('#chips button').length === 4);
    const input = doc.getElementById('input');
    input.value = 'hello there';
    doc.querySelector('form').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
    await sleep(30);
    assert('chatbot: user message appended', doc.querySelectorAll('#chat .msg.user').length === 1);
    assert('chatbot: typing indicator shown', doc.querySelector('#chat .typing') !== null);
    await sleep(1500);
    const bots = doc.querySelectorAll('#chat .msg.bot');
    assert('chatbot: scripted reply arrives', bots.length >= 2 && /Nova/.test(bots[bots.length - 1].textContent),
      bots[bots.length - 1].textContent.slice(0, 40));
    click(win, doc.getElementById('chips button') || doc.querySelector('#chips button'));
    await sleep(1500);
    assert('chatbot: suggestion chip works', doc.querySelectorAll('#chat .msg.user').length === 2);
    click(win, doc.querySelector('.clear'));
    assert('chatbot: clear resets to single greeting',
      doc.querySelectorAll('#chat .msg').length === 1);
    dom.window.close();
  }

  /* ---------------- devshowcase ---------------- */
  {
    const { dom, errors, doc, win } = await load('devshowcase.html');
    assert('devshowcase: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('devshowcase: 8 repos rendered', doc.querySelectorAll('#repos .repo').length === 8);
    assert('devshowcase: heatmap 182 cells', doc.querySelectorAll('#grid9 .cell').length === 182,
      `${doc.querySelectorAll('#grid9 .cell').length} cells`);
    const rustBtn = Array.from(doc.querySelectorAll('#filters button')).find((b) => b.dataset.l === 'Rust');
    click(win, rustBtn);
    const shown = doc.querySelectorAll('#repos .repo');
    assert('devshowcase: language filter works', shown.length === 1 && /swiftedge/.test(shown[0].textContent),
      `${shown.length} repos`);
    click(win, doc.querySelector('#filters button[data-l="All"]'));
    assert('devshowcase: All restores repos', doc.querySelectorAll('#repos .repo').length === 8);
    click(win, doc.querySelector('#repos .repo'));
    await sleep(20);
    assert('devshowcase: star action toast', /Starred/.test(doc.body.textContent));
    dom.window.close();
  }

  /* ---------------- agency ---------------- */
  {
    const { dom, errors, doc, win } = await load('agency.html');
    assert('agency: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('agency: 3 service cards', doc.querySelectorAll('.svc .card').length === 3);
    assert('agency: 4 work tiles', doc.querySelectorAll('.work .tile').length === 4);
    click(win, doc.querySelector('.work .tile'));
    await sleep(20);
    assert('agency: case-study tile fires toast', /Case study/.test(doc.body.textContent));
    click(win, doc.querySelector('header .btn'));
    await sleep(20);
    assert('agency: CTA fires toast', /Brief submitted/.test(doc.body.textContent));
    dom.window.close();
  }

  /* ---------------- education ---------------- */
  {
    const { dom, errors, doc, win } = await load('education.html');
    assert('education: boots without script errors', fatalErrors(errors).length === 0, fatalErrors(errors)[0] || '');
    assert('education: 6 courses rendered', doc.querySelectorAll('#grid .course').length === 6);
    const startPct = doc.getElementById('pct').textContent;
    assert('education: progress ring initialised', startPct === '33%', startPct);
    const search = doc.getElementById('search');
    search.value = 'sql';
    search.dispatchEvent(new win.Event('input', { bubbles: true }));
    assert('education: search filters to 1 course', doc.querySelectorAll('#grid .course').length === 1,
      `${doc.querySelectorAll('#grid .course').length} courses`);
    search.value = 'zzzz';
    search.dispatchEvent(new win.Event('input', { bubbles: true }));
    assert('education: empty state shown', /No courses match/.test(doc.getElementById('grid').textContent));
    search.value = '';
    search.dispatchEvent(new win.Event('input', { bubbles: true }));
    const designBtn = Array.from(doc.querySelectorAll('#filters button')).find((b) => b.dataset.c === 'Design');
    click(win, designBtn);
    assert('education: category filter works', doc.querySelectorAll('#grid .course').length === 2,
      `${doc.querySelectorAll('#grid .course').length} design courses`);
    click(win, doc.querySelector('#filters button[data-c="All"]'));
    const lesson = doc.querySelector('#grid .lesson');
    const before = doc.getElementById('pct').textContent;
    click(win, lesson);
    const after = doc.getElementById('pct').textContent;
    assert('education: lesson toggle advances progress', before !== after, `${before} -> ${after}`);
    dom.window.close();
  }

  /* ---------------- summary ---------------- */
  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed, ${failed.length} failed ===`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error('TEST HARNESS ERROR:', e);
  process.exit(2);
});
