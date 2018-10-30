const showdown = require('showdown');


/**
 * Convert Markdown to HTML
 * @param {string} markdown Markdown text
 */
export default function markdownToHtml(markdown) {
  if (!markdown) return '';
  // need to ignore mathquill tags

  // IMPORTANT: this line removes https protocol from an <img> tag
  // because Github flavored markdown will convert the link to <a> tag,
  // which makes the <img> tag's src value invalid
  // eg. <img src="<a href="https://example">https://example</a>" />
  markdown = markdown.replace(/<img src="https:/gm, '<img src="');

  // extension to avoid parsing HTML blocks that represent
  // math equations with mathquill
  showdown.extension('ignoreMath', function() {
    return [
      {
        type: 'lang',
        regex: /<span class=('mathquill'|\"mathquill\")>(.*?)<\/span>/gmi,
        replace: `<span class='mathquill'>$2</span>`
      }
    ];
  });

  const converter = new showdown.Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    ghMentions: true,
    emoji: true,
    openLinksInNewWindow: true,
    extensions: [
      'ignoreMath'
    ],
  });
  converter.setFlavor('github');
  let html = converter.makeHtml(markdown);

  return html;
}