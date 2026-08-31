/**
 * English crawler HTML for the hand-written static routes.
 *
 * The guide, question and collection pages generate both languages from the
 * bilingual copy they already had. These few routes never had an English
 * body written for them — their `prerenderHtml` in siteMetadata.js is Arabic
 * prose typed by hand — so the English half lives here.
 *
 * Written in English rather than translated sentence-for-sentence from the
 * Arabic: the two audiences are not the same. The Arabic pages speak to Saudi
 * candidates; the English ones speak to the nurses and doctors sitting SNLE
 * and SMLE from Pakistan, Egypt, the Philippines and elsewhere, who make up
 * 43% of this site's search clicks and could not previously find it.
 *
 * Legal routes get a short summary, exactly as the Arabic ones do — the
 * binding text is the page itself, which the app already renders in both
 * languages.
 *
 * React-free and browser-free: runs under Node at build time.
 */

/** The FAQ entries for the English /en/faq page and its FAQPage schema. */
export const FAQ_ITEMS_EN = [
    {
        question: 'What is SQB?',
        answer: 'SQB is a preparation platform for the Saudi Commission for Health Specialties exams — the SMLE for medicine and the SNLE for nursing — built around a large question bank, a written explanation for every answer, performance analytics and practical study plans.',
    },
    {
        question: 'Is SQB suitable for preparing for the SMLE?',
        answer: 'Yes. The platform is built to drill SMLE and Prometric-style questions through short and long sessions, with detailed analytics showing which specialties are costing you marks.',
    },
    {
        question: 'Does SQB cover the SNLE nursing track?',
        answer: 'Yes. Nursing is a complete, standalone track with its own question bank, illustrated summaries and analytics, covering nursing fundamentals, medical-surgical nursing, maternal and newborn nursing, paediatric nursing, mental health and pharmacology with dosage calculations.',
    },
    {
        question: 'Can I create a free account?',
        answer: 'Yes. A free account gives you 40 questions from the bank with no payment card, plus the first lesson of every specialty. There are also questions published openly on this site that need no account at all.',
    },
    {
        question: 'Does SQB work on a phone?',
        answer: 'Yes. The platform runs in the browser on phones, tablets and desktops, and can be added to a phone home screen so it opens like an app — no app store and no download.',
    },
    {
        question: 'How do I contact the SQB team?',
        answer: 'Through the contact page, by email, or on WhatsApp. Suggestions and question reports reach the same team.',
    },
];

/**
 * The English landing page.
 *
 * `guidesTeaser` and `questionsTeaser` are generated elsewhere and passed in,
 * so the English landing page links into the English guide and question trees
 * the same way the Arabic one links into the Arabic trees.
 */
export function enLandingHtml({ guidesTeaser = '', questionsTeaser = '' } = {}) {
    return `
      <main class="seo-shell" dir="ltr">
        <header class="seo-hero">
          <p class="seo-kicker">SQB</p>
          <h1>Practise for the SMLE, SNLE and Prometric exams</h1>
          <p>A question bank matched to the current Saudi Commission exam style, a written explanation for every answer, and analytics that name the specialty losing you marks — for doctors, nurses and medical students preparing in Saudi Arabia and abroad.</p>
        </header>
        <section>
          <h2>Why candidates use SQB</h2>
          <p>Because it puts structured practice, progress tracking and targeted revision in one place. Every question carries a full explanation — the concept behind it, how the presentation is distinguished, how it is diagnosed and how it is managed — so a question you get wrong turns into something that works on ten more.</p>
        </section>
        <section>
          <h2>Two separate tracks: medicine and nursing</h2>
          <p>You choose your track when you create an account. The medical track covers internal medicine, surgery, paediatrics and obstetrics &amp; gynaecology for the SMLE. The nursing track covers nursing fundamentals, medical-surgical nursing, maternal and newborn nursing, paediatric nursing, mental health and pharmacology with dosage calculations for the SNLE. Each track has its own questions, summaries and analytics.</p>
        </section>
        <section>
          <h2>What you get inside</h2>
          <ul>
            <li>Short and long practice sessions that mirror the exam format.</li>
            <li>Analytics by topic, accuracy and answer speed.</li>
            <li>A page collecting every question you got wrong, searchable and filterable.</li>
            <li>Illustrated summaries of the highest-yield topics.</li>
            <li>Timed mock exams under real exam conditions.</li>
          </ul>
        </section>
${questionsTeaser}
${guidesTeaser}
        <nav aria-label="Key links">
          <a href="/en/about">About SQB</a>
          <a href="/en/guides">Study guides</a>
          <a href="/en/questions">Free practice questions</a>
          <a href="/en/past-papers">Question collections</a>
          <a href="/en/faq">Frequently asked questions</a>
          <a href="/en/contact">Contact us</a>
          <a href="/signup">Create a free account</a>
        </nav>
      </main>
    `;
}

/** The free-questions teaser on the English landing page. */
export function enQuestionsTeaserHtml() {
    return `        <section>
          <h2>Free practice questions, no account</h2>
          <p>A sample of the bank is published openly: exam-style questions in medicine and nursing, each showing its four options and a written explanation of why the answer is right. You need neither an account nor a payment card to read them.</p>
          <p><a href="/en/questions">Browse the free practice questions</a></p>
        </section>`;
}

/** Everything else, keyed by the language-neutral route path. */
export const EN_PRERENDER = {
    '/about': `
      <main class="seo-shell" dir="ltr">
        <h1>About SQB</h1>
        <p>SQB is an exam-preparation platform for the Saudi Commission for Health Specialties licensing exams — the SMLE for medicine and the SNLE for nursing — and for Prometric-style testing generally.</p>
        <p>The platform is built around one idea: a large question bank only helps if every question teaches you something. Every item in the bank carries a written, reviewed explanation covering the core concept, the presentation that distinguishes it, how it is diagnosed and how it is managed — including why the other options are wrong.</p>
        <p>Alongside the questions sit illustrated topic summaries, analytics that identify your weakest specialty automatically, and a page that collects every question you answered incorrectly so you can work through your own mistakes.</p>
        <nav aria-label="Key links">
          <a href="/en/faq">Frequently asked questions</a>
          <a href="/en/guides">Study guides</a>
          <a href="/en/questions">Free practice questions</a>
          <a href="/en/contact">Contact us</a>
        </nav>
      </main>
    `,

    '/faq': `
      <main class="seo-shell" dir="ltr">
        <h1>Frequently asked questions</h1>
        <p>The questions we are asked most often about SQB — the question bank, the nursing track, free access, subscriptions and support.</p>
        <ul>
          ${FAQ_ITEMS_EN.map((item) => `<li><strong>${item.question}</strong><p>${item.answer}</p></li>`).join('')}
        </ul>
        <nav aria-label="Key links">
          <a href="/en/about">About SQB</a>
          <a href="/en/questions">Free practice questions</a>
          <a href="/en/contact">Contact us</a>
        </nav>
      </main>
    `,

    '/contact': `
      <main class="seo-shell" dir="ltr">
        <h1>Contact SQB</h1>
        <p>Questions about a subscription, a problem with your account, or a mistake you have spotted in a question — the contact page reaches the team directly by email or WhatsApp.</p>
        <p>Reporting a question you believe is wrong is genuinely useful: reports are reviewed against the source and the bank is corrected.</p>
        <nav aria-label="Key links">
          <a href="/en/faq">Frequently asked questions</a>
          <a href="/en/about">About SQB</a>
        </nav>
      </main>
    `,

    '/groups': `
      <main class="seo-shell" dir="ltr">
        <h1>Group plans for study partners</h1>
        <p>If you are preparing alongside classmates, a group plan costs considerably less per person than individual subscriptions.</p>
        <p>One payment activates your own account immediately and gives you single-use invite links for the remaining seats to hand out. Every seat ends on the same date, and each link opens exactly one account.</p>
        <p>Group plans are available for both tracks — the SMLE medical bank and the SNLE nursing bank — with the same content, analytics and summaries as an individual subscription.</p>
        <nav aria-label="Key links">
          <a href="/en/faq">Frequently asked questions</a>
          <a href="/en/questions">Free practice questions</a>
          <a href="/en/contact">Contact us</a>
        </nav>
      </main>
    `,

    '/privacy': `
      <main class="seo-shell" dir="ltr">
        <h1>Privacy policy</h1>
        <p>What data SQB collects when you create an account and use the platform, why it is collected, how long it is kept, and the rights you have over it.</p>
      </main>
    `,

    '/terms': `
      <main class="seo-shell" dir="ltr">
        <h1>Terms of service</h1>
        <p>The terms governing the use of SQB: accounts, subscriptions, acceptable use of the question bank, and the limits of the service.</p>
      </main>
    `,

    '/refund-policy': `
      <main class="seo-shell" dir="ltr">
        <h1>Refund policy</h1>
        <p>When a subscription can be refunded, the window in which a request must be made, and how a refund is processed.</p>
      </main>
    `,

    '/login': `
      <main class="seo-shell" dir="ltr">
        <h1>Log in to SQB</h1>
        <p>Sign in to continue practising, review your analytics and pick up where you left off.</p>
      </main>
    `,

    '/signup': `
      <main class="seo-shell" dir="ltr">
        <h1>Create a free SQB account</h1>
        <p>A free account gives you 40 questions from the bank with no payment card, plus the first lesson of every specialty. Choose your track — medicine for the SMLE or nursing for the SNLE — when you sign up.</p>
      </main>
    `,
};
