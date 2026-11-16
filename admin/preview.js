// Sveltia CMS preview: makes the editor preview look like the live site.
// Docs: https://sveltiacms.app/en/docs/api/preview-styles and /preview-templates
// /admin/preview.css is generated at build time (see astro.config.mjs) from the site's real CSS.
// Class names below match the site's components (PageHeader, AuthorBox, DraftBanner ...).
(function () {
  if (!window.CMS) return;

  var SITE_TITLE = 'Klinik Psikolog Zeyna Karanlık';
  var DRAFT_NOTE = 'TASLAK – Zeyna onaylayacak';
  var AREAS = {
    'kaygi-bozukluklari': 'Kaygı Bozuklukları',
    'panik-atak': 'Panik Atak',
    depresyon: 'Depresyon',
    travma: 'Travma',
    dehb: 'DEHB',
    'yas-sureci': 'Yas ve Kayıp Süreçleri',
    psikoonkoloji: 'Psikoonkoloji',
    'gelecek-kaygisi': 'Gelecek Kaygısı ve Yetişkinlik',
  };

  CMS.registerPreviewStyle('/admin/preview.css');

  function toList(v) {
    if (!v) return [];
    if (typeof v.toJS === 'function') return v.toJS();
    return Array.isArray(v) ? v : [];
  }

  function formatDate(value) {
    if (!value) return '';
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function draftBanner(entry) {
    if (entry.getIn(['data', 'approved'])) return null;
    return html`<p class="draft-banner" role="note"><strong>${DRAFT_NOTE}</strong></p>`;
  }

  function BlogPreview(props) {
    var entry = props.entry;
    var data = function (k) { return entry.getIn(['data', k]); };
    var pub = data('pubDate');
    var upd = data('updatedDate');
    var related = toList(data('relatedAreas')).filter(function (id) { return AREAS[id]; });
    var imgPath = data('image');
    var img = imgPath ? props.getAsset(imgPath) : null;

    return html`
      <div class="cms-preview">
        ${draftBanner(entry)}
        <article>
          <header class="page-header">
            <div class="container">
              <p class="breadcrumb"><a href="/blog">← Blog</a></p>
              <h1>${data('title')}</h1>
              ${data('description') ? html`<p class="lead">${data('description')}</p>` : null}
              <p class="post-meta">
                ${pub ? html`<time>${formatDate(pub)}</time>` : null}
                ${upd ? html` · Son güncelleme: <time>${formatDate(upd)}</time>` : null}
              </p>
            </div>
          </header>
          <div class="container">
            <div class="prose">
              ${img ? html`<img class="post-image" src=${img.toString()} alt=${data('imageAlt') || ''} />` : null}
              ${props.widgetFor('body')}
              <aside class="author-box" aria-label="Yazar">
                <p class="author-name">${SITE_TITLE}</p>
                <p>Yetişkinlerle psikodinamik / psikanalitik yönelimli bireysel psikoterapi çalışmaktadır.</p>
                <p><a href="/hakkimda">Hakkımda sayfasına göz atın</a></p>
              </aside>
              ${related.length > 0
                ? html`<nav class="related" aria-label="İlgili çalışma alanları">
                    <h2>İlgili çalışma alanları</h2>
                    <ul>${related.map(function (id) { return html`<li key=${id}><a href=${'/calisma-alanlari/' + id}>${AREAS[id]}</a></li>`; })}</ul>
                    <p>Ön görüşme için <a href="/iletisim">iletişim</a> sayfasına bakabilirsiniz.</p>
                  </nav>`
                : null}
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function AreaPreview(props) {
    var entry = props.entry;
    var data = function (k) { return entry.getIn(['data', k]); };
    return html`
      <div class="cms-preview">
        ${draftBanner(entry)}
        <header class="page-header">
          <div class="container">
            <p class="breadcrumb"><a href="/calisma-alanlari">← Çalışma Alanları</a></p>
            <h1>${data('title')}</h1>
            ${data('description') ? html`<p class="lead">${data('description')}</p>` : null}
          </div>
        </header>
        <div class="container">
          <div class="prose">${props.widgetFor('body')}</div>
        </div>
      </div>
    `;
  }

  CMS.registerPreviewTemplate('blog', BlogPreview);
  CMS.registerPreviewTemplate('areas', AreaPreview);
})();
