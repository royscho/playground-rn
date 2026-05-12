import { linking } from './linking';

describe('linking config', () => {
  it('has playground:// prefix', () => {
    expect(linking.prefixes).toContain('playground://');
  });

  const drawerScreens = linking.config?.screens?.AppDrawer as { screens: Record<string, unknown> };

  it('maps dashboard to HomeTabs > Dashboard', () => {
    const homeTabs = drawerScreens.screens.HomeTabs as { screens: Record<string, string> };
    expect(homeTabs.screens.Dashboard).toBe('dashboard');
  });

  it('maps posts/:id to PostDetail', () => {
    const posts = drawerScreens.screens.Posts as { screens: Record<string, string> };
    expect(posts.screens.PostDetail).toBe('posts/:id');
  });

  it('maps settings', () => {
    expect(drawerScreens.screens.Settings).toBe('settings');
  });
});
