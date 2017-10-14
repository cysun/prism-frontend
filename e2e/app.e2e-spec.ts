import {PrsFrontendPage} from './app.po';

describe('prs-frontend App', () => {
  let page: PrsFrontendPage;

  beforeEach(() => {
    page = new PrsFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('prs works!');
  });
});
