import { VtaProjectPage } from './app.po';

describe('vta-project App', function() {
  let page: VtaProjectPage;

  beforeEach(() => {
    page = new VtaProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
