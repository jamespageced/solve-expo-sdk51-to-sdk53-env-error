type NavScreen = { route: string; title: string };

type NavScreens = {
  home: NavScreen;
  simpleScandit: NavScreen;
};

export const navRoutesToTitles: any = {
  home: 'AMS 365',
  'simple-scandit': ''
};

export const screens: NavScreens = {
  home: { route: 'home', title: 'Home' },
  simpleScandit: { route: 'simple-scandit', title: '' }
};
