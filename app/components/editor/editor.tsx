import * as React from "react";
import { createHighlighter, Highlighter } from "shiki";
import { Language, Theme } from "./constants";

const _code = `
import { createHighlighter } from "shiki";
import { autoload, hookClosingPairs, hookTab } from "shikicode/plugins";
`; // input code

export type EditorProps = {
  language: Language;
  theme: Theme;
  color: string;
};

type Color = {
  bg: string;
  fg: string;
};

export function Editor(props: EditorProps) {
  const [code, setCode] = React.useState(_code);
  const [html, setHtml] = React.useState("");
  const [color, setColor] = React.useState<Color | undefined>(undefined);
  const [highlighter, setHighlighter] = React.useState<Highlighter | undefined>(
    undefined,
  );
  const areaRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    let _highlighter = highlighter;

    async function create() {
      if (_highlighter) _highlighter.dispose();

      _highlighter = await createHighlighter({
        langs: [props.language],
        themes: [props.theme],
      });

      setHighlighter(_highlighter);
    }

    if (!_highlighter) create();
    else {
      const languages = _highlighter?.getLoadedLanguages();
      const themes = _highlighter?.getLoadedThemes();

      const hasChanged =
        !languages.includes(props.language) || !themes.includes(props.theme);

      if (hasChanged) create();
    }
  }, [props.language, props.theme, highlighter, code]);

  React.useLayoutEffect(() => {
    if (!highlighter) return;

    const languages = highlighter.getLoadedLanguages();
    const themes = highlighter.getLoadedThemes();

    const theme = themes[0];
    const color = highlighter.getTheme(theme);

    setColor({ bg: color.bg, fg: color.fg });
    setHtml(highlighter.codeToHtml(code, { theme, lang: languages[0] }));
  }, [highlighter, code]);

  return (
    <div
      data-editor
      className="relative h-full w-full"
      style={
        {
          "--bg": color?.bg,
          "--fg": color?.fg,
          "--mix-color": "#9f9f9f",
          "--highlight": props.color,
        } as React.CSSProperties
      }
    >
      <header data-editor-header className="flex h-10 items-stretch">
        <div className="h-10 shrink-0 border border-transparent border-b-[var(--highlight)] px-4 py-2 text-sm outline-none">
          <span
            role="textbox"
            className="text-muted-foregroundtext-xs h-10 min-w-4 outline-none"
            contentEditable
          >
            sample.js
          </span>
        </div>
        <div data-editor-space className="h-10 grow border border-r-0"></div>
      </header>
      <div
        ref={areaRef}
        data-editor-area
        className="relative h-auto min-h-60 w-full"
      >
        <textarea
          data-editor-textarea
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyUp={(e) => {
            if (areaRef.current) {
              areaRef.current.style.height = "auto";
              areaRef.current.style.height = `${e.target.scrollHeight}px`;
            }
          }}
        />
        <div
          data-editor-preview
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      </div>
    </div>
  );
}
