const helpers = require('../../../helpers');

describe('tutorial layout', () => {
    // TODO: more tests

    describe('content', () => {
        it('should render the tutorial content as Markdown', () => {
            const text = helpers.render('tutorial', {
                tutorialContent: '## Test'
            });

            expect(text).toContain('<h2>Test</h2>');
        });
    });
});
