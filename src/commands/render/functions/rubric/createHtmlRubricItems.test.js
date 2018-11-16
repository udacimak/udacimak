import faker from 'faker';
import createHtmlRubricItems from './createHtmlRubricItems';


describe('Create HTML Rubric Items', () => {
  test('should create rows of rubric items', () => {
    const passedDescription = faker.lorem.paragraph();
    const criteria = faker.lorem.paragraph();
    const rubricItems = [
      {
        passed_description: passedDescription,
        criteria,
      }
    ];

    const html = createHtmlRubricItems(rubricItems);
    expect(html).toMatch(passedDescription);
    expect(html).toMatch(criteria);
    expect(html).toMatch(/<tr.*>/i);
  });
});
