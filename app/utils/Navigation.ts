type NavScreen = { route: string; title: string };

type NavScreens = {
  home: NavScreen;
  form: NavScreen;
};

export const navScreens: NavScreens = {
  home: { route: 'home', title: 'Home' },
  form: { route: 'form', title: 'Form' }
};
