import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { AppProvider } from "../src/ui/providers/app-provider";
import { ArticleAudioProvider } from "../src/ui/providers/article-audio-provider";
import { MockArticleProvider } from "../src/ui/providers/mocks/mock-article-provider";
import { MockFeaturedArticlesProvider } from "../src/ui/providers/mocks/mock-featured-articles-provider";
import { MockSearchProvider } from "../src/ui/providers/mocks/mock-search-provider";
import { MockSeeAlsoProvider } from "../src/ui/providers/mocks/mock-see-also-provider";
import "../src/app/globals.css";
import "./preview.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openDyslexic = localFont({
  variable: "--font-opendyslexic",
  display: "swap",
  preload: false,
  src: [
    {
      path: "../src/app/fonts/opendyslexic/opendyslexic-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/app/fonts/opendyslexic/opendyslexic-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    center: true,
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
        "high-contrast": "high-contrast",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    (Story) => (
      <AppProvider>
        <MockArticleProvider>
          <ArticleAudioProvider>
            <MockSeeAlsoProvider>
              <MockSearchProvider>
                <MockFeaturedArticlesProvider>
                  <Story />
                </MockFeaturedArticlesProvider>
              </MockSearchProvider>
            </MockSeeAlsoProvider>
          </ArticleAudioProvider>
        </MockArticleProvider>
      </AppProvider>
    ),
    (Story) => {
      document.documentElement.classList.add(
        geistSans.variable,
        geistMono.variable,
        openDyslexic.variable,
        "antialiased",
      );

      return <Story />;
    },
    (Story, { parameters, viewMode }) => {
      if (parameters.center === false) return <Story />;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: viewMode === "docs" ? undefined : "100vh",
            padding: "1.5rem",
            boxSizing: "border-box",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
