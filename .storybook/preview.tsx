import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "../src/ui/providers/app-provider";
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

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    // Custom: stories are centered on both axes unless they set `center: false`.
    center: true,
    nextjs: { appDirectory: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
    (Story) => {
      // The app applies these on <html> (see src/app/layout.tsx), so the
      // font variables must live there too for `font-sans` on <body>.
      document.documentElement.classList.add(
        geistSans.variable,
        geistMono.variable,
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
