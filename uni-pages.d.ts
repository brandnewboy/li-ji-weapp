/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/index" |
       "/pages/about/index" |
       "/pages/book/detail" |
       "/pages/book/edit" |
       "/pages/book/index" |
       "/pages/family/index" |
       "/pages/friend/index" |
       "/pages/giftOut/index" |
       "/pages/mine/index" |
       "/pages-sub/contributors/index";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  url: "/pages/book/index" | "/pages/giftOut/index" | "/pages/friend/index" | "/pages/mine/index"
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
