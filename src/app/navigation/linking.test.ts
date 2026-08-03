import { linking } from './linking';

describe('linking config', () => {
  it('has playground:// prefix', () => {
    expect(linking.prefixes).toContain('playground://');
  });

  const drawerScreens = linking.config?.screens?.AppDrawer as { screens: { Main: { screens: Record<string, unknown> } } };
  const mainScreens = drawerScreens.screens.Main.screens;

  it('maps feed to HomeTabs > Feed', () => {
    const homeTabs = mainScreens.HomeTabs as { screens: Record<string, string> };
    expect(homeTabs.screens.Feed).toBe('feed');
  });

  it('maps posts/:id to PostDetail', () => {
    const posts = mainScreens.Posts as { screens: Record<string, string> };
    expect(posts.screens.PostDetail).toBe('posts/:id');
  });

  it('maps settings via HomeTabs', () => {
    const homeTabs = mainScreens.HomeTabs as { screens: Record<string, string> };
    expect(homeTabs.screens.Settings).toBe('settings');
  });
});
