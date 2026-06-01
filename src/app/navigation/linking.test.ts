import { linking } from './linking';

describe('linking config', () => {
  it('has playground:// prefix', () => {
    expect(linking.prefixes).toContain('playground://');
  });

  const drawerScreens = linking.config?.screens?.AppDrawer as { screens: Record<string, unknown> };

  it('maps feed to HomeTabs > Feed', () => {
    const homeTabs = drawerScreens.screens.HomeTabs as { screens: Record<string, string> };
    expect(homeTabs.screens.Feed).toBe('feed');
  });

  it('maps posts/:id to PostDetail', () => {
    const posts = drawerScreens.screens.Posts as { screens: Record<string, string> };
    expect(posts.screens.PostDetail).toBe('posts/:id');
  });

  it('maps settings via HomeTabs', () => {
    const homeTabs = drawerScreens.screens.HomeTabs as { screens: Record<string, string> };
    expect(homeTabs.screens.Settings).toBe('settings');
  });
});
