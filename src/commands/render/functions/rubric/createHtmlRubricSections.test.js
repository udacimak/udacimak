import faker from 'faker';
import createHtmlRubricSections from './createHtmlRubricSections';


describe('Create HTML Rubric Sections', () => {
  test('should create table of rubrics', () => {
    const name = faker.lorem.words();
    const sections = [
      {
        name,
        rubric_items: [
          {
            passed_description: faker.lorem.paragraph(),
            criteria: faker.lorem.paragraph(),
          }
        ]
      }
    ];

    const html = createHtmlRubricSections(sections);
    expect(html).toMatch(name);
    expect(html).toMatch(/<table.*>/i);
    expect(html).toMatch(/<td.*>/i);
  });
});
