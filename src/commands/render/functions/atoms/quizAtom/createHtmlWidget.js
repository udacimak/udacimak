/**
 * Create HTML for Widget in an ImageFormQuestion
 * @param {object} widget json data
 */
export default function createHtmlWidget(widget) {
  const {
    group, label, marker, placement,
  } = widget;

  let htmlInput = '';
  switch (widget.model) {
    case 'CheckboxWidget':
      htmlInput += `
        <input type="checkbox" style="width: 100%; height: 100%; max-width: 15px; max-height: 15px;" name="${group}" id="${marker}" aria-label="${label || ''}">
      `;
      break;

    case 'NumericInputWidget':
      htmlInput += `
        <input type="number" style="width: 100%; height: 100%;" name="${group}" id="${marker}" aria-label="${label || ''}">
      `;
      break;

    case 'RadioButtonWidget':
      htmlInput += `
        <input type="radio" name="${group}" id="${marker}" aria-label="${label || ''}">
      `;
      break;

    case 'TextInputWidget':
      htmlInput += `
        <input type="text" style="width: 100%; height: 100%;" name="${group}" id="${marker}" aria-label="${label || ''}">
      `;
      break;

    default:
      break;
  }

  const style = `
    position: absolute; top: ${placement.y * 100}%; left: ${placement.x * 100}%; width: ${placement.width * 100}%; height: ${placement.height * 100}%;
  `;

  const html = `
    <div style="${style}">
      ${htmlInput}
    </div>
  `;

  return html;
}
