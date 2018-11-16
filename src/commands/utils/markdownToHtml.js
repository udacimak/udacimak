import showdown from 'showdown';


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
  markdown = markdown
    .replace(/<img src="https:/gmi, '<img src="')
    // hack to fix syntax highlight code block syntax
    .replace(/```[ ]+(cpp|python|javascript|ruby|shell|html|css)/gmi, '```');

  // extension to modify mathquill tags
  showdown.extension('modifyMathquill', () => [
    {
      type: 'lang',
      filter: (text) => {
        const pattern = /<span class=('|\")mathquill('|\")>((\r\n|\r|\n|.)*?)<\/span>/gmi;
        // const patternHtml = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/g;

        const result = text
          .replace(pattern, (match, p1, p2, p3, offset, string) => { // eslint-disable-line
            const math = p3
              // hack to fix backslash. For some reason, showdown convert
              // "\\" to "\", which break latex division syntax!
              .replace(/\\\\/g, '%UDACIMAK_REPLACE_BLACKSLASH%')
              // remove new line characters, it should not be in latex syntax
              .replace(/(\r|\n|\r\n)/g, '');
            return `<span class="mathquill ud-math">${math}</span>`;
          });

        return result;
      },
    }, {
      type: 'output',
      regex: /%UDACIMAK_REPLACE_BLACKSLASH%/g,
      replace: '\\\\',
    },
  ]);

  const converter = new showdown.Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    ghMentions: true,
    emoji: true,
    openLinksInNewWindow: true,
    extensions: [
      'modifyMathquill',
    ],
  });
  converter.setFlavor('github');
  const html = converter.makeHtml(markdown);

  return html;
}
