import { NavScreens } from '@app/types';

export const navRoutesToTitles: { [K in keyof NavScreens]: string } = {
  about: 'About',
  contact: 'Contact',
  home: 'Home',
  modalHamburgerMenu: ''
};

export const screens: NavScreens = {
  about: { route: 'about', title: navRoutesToTitles.about },
  contact: { route: 'contact', title: navRoutesToTitles.contact },
  home: { route: 'home', title: navRoutesToTitles.home },
  modalHamburgerMenu: { route: 'modal-hamburger-menu', title: navRoutesToTitles.modalHamburgerMenu }
};
