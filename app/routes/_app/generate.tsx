import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { LANGUAGES, THEMES } from "~/components/editor/constants";
import { Editor } from "~/components/editor/editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordian";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { ColorPicker } from "~/components/ui/color-picker";
import {
  ColorSwatchPicker,
  LinearGradientColorSwatchPicker,
} from "~/components/ui/color-swatch-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ScrollArea, ScrollAreaBoth } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";
import { Canvg } from "canvg";
import html2canvas from "html2canvas-pro";
import * as React from "react";
import { parseColor } from "react-aria-components";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_app/generate")({
  head: () => ({
    meta: [
      {
        title: "Generate | snippets",
        description:
          "Create beautiful code snippets in language of your choice and share it with your friends",
      },
      {
        name: "keywords",
        content: "code snippets, code, snippets, code snippets generator",
      },
    ],
  }),
  component: GeneratePage,
});

type GenerateForm = UseFormReturn<z.infer<typeof formSchema>>;

const MAX_WIDTH = 1100;
const MIN_WIDTH = 500;
const MAX_PADDING_Y = 200;
const MIN_PADDING_Y = 10;
const MAX_PADDING_X = 200;
const MIN_PADDING_X = 10;

const MAX_SHADOW_OPACITY = 1;
const MIN_SHADOW_OPACITY = 0;
const STEP_SHADOW_OPACITY = 0.01;

const MAX_SHADOW_OFFSET_X = 100;
const MIN_SHADOW_OFFSET_X = 0;

const MAX_SHADOW_OFFSET_Y = 100;
const MIN_SHADOW_OFFSET_Y = 0;

const MAX_SHADOW_BLUR = 100;
const MIN_SHADOW_BLUR = 0;

const MAX_SHADOW_SPREAD = 100;
const MIN_SHADOW_SPREAD = 0;

const FONT_FAMILY_OPTIONS = [
  { name: "IBM Plex Mono", value: "ibm-plex-mono-font-family" },
  { name: "Geist Mono", value: "geist-mono-font-family" },
  { name: "Monospace", value: "monospace-font-family" },
];

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 24;
const STEP_FONT_SIZE = 1;

const formSchema = z.object({
  theme: z.string().min(2, {
    message: "theme must be at least 2 characters.",
  }),
  language: z.string().min(2, {
    message: "language must be at least 2 characters.",
  }),
  "background-type": z.string().min(2, {
    message: "background-type must be at least 2 characters.",
  }),
  "background-color": z.string().min(2, {
    message: "background-color must be at least 2 characters.",
  }),
  "background-color-end": z.string().min(2, {
    message: "background-color-end must be at least 2 characters.",
  }),
  "background-direction": z.number().min(2, {
    message: "background-direction must be at least 2 characters.",
  }),
  "layout-width": z.number().min(2, {
    message: "layout-width must be at least 2 characters.",
  }),
  "layout-padding-y": z.number().min(2, {
    message: "layout-padding-y must be at least 2 characters.",
  }),
  "layout-padding-x": z.number().min(2, {
    message: "layout-padding-x must be at least 2 characters.",
  }),
  shadow: z.boolean(),
  "shadow-color": z.string().min(2, {
    message: "shadow-color must be at least 2 characters.",
  }),
  "shadow-opacity": z.number().min(2, {
    message: "shadow-opacity must be at least 2 characters.",
  }),
  "shadow-offset-x": z.number().min(2, {
    message: "shadow-offset-x must be at least 2 characters.",
  }),
  "shadow-offset-y": z.number().min(2, {
    message: "shadow-offset-y must be at least 2 characters.",
  }),
  "shadow-blur": z.number().min(2, {
    message: "shadow-blur must be at least 2 characters.",
  }),
  "shadow-spread": z.number().min(2, {
    message: "shadow-spread must be at least 2 characters.",
  }),
  "font-family": z.string().min(2, {
    message: "font-family must be at least 2 characters.",
  }),
  "font-size": z.number().min(2, {
    message: "font-size must be at least 2 characters.",
  }),
});

function GeneratePage() {
  const [format, setFormat] = React.useState<"png" | "svg">("png");
  const editorRef = React.useRef<HTMLDivElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "vitesse-dark",
      language: "javascript",
      "background-type": "linear-gradient",
      "background-color": "hsla(23, 100%, 50%, 1)",
      "background-color-end": "hsla(23, 0%, 100%, 1)",
      "background-direction": 45,
      "layout-width": 800,
      "layout-padding-y": 30,
      "layout-padding-x": 30,
      shadow: false,
      "shadow-color": "hsla(23, 100%, 50%, 1)",
      "shadow-opacity": 0.5,
      "shadow-offset-y": 10,
      "shadow-offset-x": 10,
      "shadow-blur": 10,
      "shadow-spread": 10,
      "font-family": "ibm-plex-mono-font-family",
      "font-size": 16,
    },
  });

  const paddingY = useWatch({
    control: form.control,
    name: "layout-padding-y",
  });
  const paddingX = useWatch({
    control: form.control,
    name: "layout-padding-x",
  });
  const width = useWatch({
    control: form.control,
    name: "layout-width",
  });
  const backgroundType = useWatch({
    control: form.control,
    name: "background-type",
  });
  const backgroundColor = useWatch({
    control: form.control,
    name: "background-color",
  });
  const backgroundColorEnd = useWatch({
    control: form.control,
    name: "background-color-end",
  });
  const backgroundDirection = useWatch({
    control: form.control,
    name: "background-direction",
  });
  const language = useWatch({
    control: form.control,
    name: "language",
  });
  const theme = useWatch({
    control: form.control,
    name: "theme",
  });
  const showShadow = useWatch({
    control: form.control,
    name: "shadow",
  });

  const shadowColor = useWatch({
    control: form.control,
    name: "shadow-color",
  });
  const shadowOpacity = useWatch({
    control: form.control,
    name: "shadow-opacity",
  });
  const shadowOffsetX = useWatch({
    control: form.control,
    name: "shadow-offset-x",
  });
  const shadowBlur = useWatch({
    control: form.control,
    name: "shadow-blur",
  });
  const shadowSpread = useWatch({
    control: form.control,
    name: "shadow-spread",
  });
  const fontFamily = useWatch({
    control: form.control,
    name: "font-family",
  });
  const fontSize = useWatch({
    control: form.control,
    name: "font-size",
  });
  const parsedShadowColor = parseColor(shadowColor);

  const shadow = showShadow
    ? `hsla(${parsedShadowColor.getChannelValue("hue")}, ${parsedShadowColor.getChannelValue("saturation")}%, ${parsedShadowColor.getChannelValue("lightness")}%, ${shadowOpacity}) ${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px`
    : "";

  async function handleClick() {
    if (!editorRef.current) return;

    const canvas = await html2canvas(editorRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
    });
    if (format === "png") {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "code.png";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } else {
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const svg = await Canvg.from(ctx, canvas.toDataURL("image/png"));

      console.log(svg);
    }
  }

  return (
    <Form {...form}>
      <div className="flex h-full">
        <aside className="border-border bg-sidebar h-full w-80 min-w-0 shrink-0 border-r">
          <ScrollArea className="h-full p-4">
            <SnippetForm form={form} />
          </ScrollArea>
        </aside>

        <ScrollAreaBoth className="h-full grow *:data-radix-scroll-area-viewport:*:h-full">
          <div className="flex h-full items-center justify-center p-8">
            <div
              ref={editorRef}
              className={cn(
                "w-[var(--width)] bg-[var(--bg)] px-[var(--padding-y)] py-[var(--padding-x)]",
                backgroundType === "linear-gradient" &&
                  "bg-linear-0 from-[var(--bg)] to-[var(--bg-end)]",
              )}
              style={
                {
                  "--padding-y": `${paddingY}px`,
                  "--padding-x": `${paddingX}px`,
                  "--width": `${width}px`,
                  "--bg": backgroundColor,
                  "--bg-end":
                    backgroundType === "linear-gradient"
                      ? backgroundColorEnd
                      : "",
                  "--tw-gradient-position":
                    backgroundType === "linear-gradient"
                      ? `${backgroundDirection}deg in hsl,`
                      : "",
                  "--shadow": showShadow ? shadow : "",
                  "--font-family": `var(--${fontFamily})`,
                  "--font-size": `${fontSize}px`,
                } as React.CSSProperties
              }
            >
              <Editor
                language={language}
                theme={theme}
                color={backgroundColor}
              />
            </div>
          </div>
        </ScrollAreaBoth>

        <aside className="border-border bg-sidebar h-full w-80 min-w-0 shrink-0 border-l">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-xs font-medium">Copy</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium">Export</h3>
                  <Select
                    value={format}
                    onValueChange={(value) => setFormat(value as "png" | "svg")}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      {/* <SelectItem value="svg">SVG</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleClick}
                >
                  Download
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-medium">Share</h3>
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </Form>
  );
}

export function SnippetForm({ form }: { form: GenerateForm }) {
  const backgroundType = useWatch({
    control: form.control,
    name: "background-type",
  });
  const showShadow = useWatch({
    control: form.control,
    name: "shadow",
  });

  return (
    <form className="space-y-8">
      <fieldset>
        <Accordion
          type="multiple"
          defaultValue={["general", "background", "layout", "shadow", "font"]}
        >
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {THEMES.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="background">
            <AccordionTrigger>Background</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="background-type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="linear-gradient">
                          Linear Gradient
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {backgroundType === "solid" && (
                <ColorSwatchPicker
                  onChange={(color) => {
                    form.setValue("background-color", color);
                  }}
                  colors={[
                    "#dc2626",
                    "#ea580c",
                    "#14b8a6",
                    "#06b6d4",
                    "#3b82f6",
                    "#8b5cf6",
                    "#a855f7",
                    "#d946ef",
                    "#ec4899",
                    "#e11d48",
                    "#10b981",
                    "#65a30d",
                    "#f59e0b",
                    "#d97706",
                    "#713f12",
                    "#334155",
                    "#6b7280",
                  ]}
                />
              )}

              {backgroundType === "linear-gradient" && (
                <LinearGradientColorSwatchPicker
                  onChange={(color) => {
                    form.setValue("background-color", color.start);
                    form.setValue("background-color-end", color.end);
                  }}
                  colors={[
                    { start: "#a78bfa", end: "#d8b4fe" },
                    { start: "#d946ef", end: "#f43f5e" },
                    { start: "#f59e0b", end: "#facc15" },
                    { start: "#93c5fd", end: "#3730a3" },
                    { start: "#9ca3af", end: "#374151" },
                    { start: "#171717", end: "#a3a3a3" },
                    { start: "#3b82f6", end: "#14b8a6" },
                    { start: "#bae6fd", end: "#38bdf8" },
                    { start: "#93c5fd", end: "#a855f7" },
                    { start: "#ef4444", end: "#f97316" },
                    { start: "#cbd5e1", end: "#44403c" },
                    { start: "#4ade80", end: "#0d9488" },
                    { start: "#fecdd3", end: "#db2777" },
                  ]}
                />
              )}

              <FormField
                control={form.control}
                name="background-color"
                render={({ field }) => (
                  <FormItem>
                    <ColorPicker
                      label={`${backgroundType === "linear-gradient" ? "Color Start" : "Color"}`}
                      value={field.value}
                      onChange={field.onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              {backgroundType === "linear-gradient" && (
                <FormField
                  control={form.control}
                  name="background-color-end"
                  render={({ field }) => (
                    <FormItem>
                      <ColorPicker
                        label="Color End"
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {backgroundType === "linear-gradient" && (
                <FormField
                  control={form.control}
                  name="background-direction"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Direction</FormLabel>
                        <span className="text-muted-foreground text-sm">
                          {field.value}deg
                        </span>
                      </div>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={0}
                          max={359}
                          step={1}
                          onValueChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="layout">
            <AccordionTrigger>Layout</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="layout-width"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Width</FormLabel>
                      <span className="text-muted-foreground text-sm">
                        {field.value}px
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={MIN_WIDTH}
                        max={MAX_WIDTH}
                        step={1}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="layout-padding-y"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Padding (Y)</FormLabel>
                      <span className="text-muted-foreground text-sm">
                        {field.value}px
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={MIN_PADDING_Y}
                        max={MAX_PADDING_Y}
                        step={1}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="layout-padding-x"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Padding (X)</FormLabel>
                      <span className="text-muted-foreground text-sm">
                        {field.value}px
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        min={MIN_PADDING_X}
                        max={MAX_PADDING_X}
                        step={1}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shadow">
            <AccordionTrigger>Shadow</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="shadow"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start justify-between">
                    <div className="space-y-1 leading-none">
                      <FormLabel>Show Shadow</FormLabel>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showShadow && (
                <>
                  <FormField
                    control={form.control}
                    name="shadow-color"
                    render={({ field }) => (
                      <FormItem>
                        <ColorPicker
                          label="Color"
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shadow-opacity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Opacity</FormLabel>
                          <span className="text-muted-foreground text-sm">
                            {field.value}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={MAX_SHADOW_OPACITY}
                            min={MIN_SHADOW_OPACITY}
                            step={STEP_SHADOW_OPACITY}
                            onValueChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shadow-offset-x"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Offset X</FormLabel>
                          <span className="text-muted-foreground text-sm">
                            {field.value}px
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={MAX_SHADOW_OFFSET_X}
                            min={MIN_SHADOW_OFFSET_X}
                            step={1}
                            onValueChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shadow-offset-y"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Offset Y</FormLabel>
                          <span className="text-muted-foreground text-sm">
                            {field.value}px
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={MAX_SHADOW_OFFSET_Y}
                            min={MIN_SHADOW_OFFSET_Y}
                            step={1}
                            onValueChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shadow-blur"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Blur</FormLabel>
                          <span className="text-muted-foreground text-sm">
                            {field.value}px
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={MAX_SHADOW_BLUR}
                            min={MIN_SHADOW_BLUR}
                            step={1}
                            onValueChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shadow-spread"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Spread</FormLabel>
                          <span className="text-muted-foreground text-sm">
                            {field.value}px
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={MAX_SHADOW_SPREAD}
                            min={MIN_SHADOW_SPREAD}
                            step={1}
                            onValueChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="font">
            <AccordionTrigger>Font</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <FormField
                control={form.control}
                name="font-family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font family" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FONT_FAMILY_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="font-size"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Size</FormLabel>
                      <span className="text-muted-foreground text-sm">
                        {field.value}px
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={MAX_FONT_SIZE}
                        min={MIN_FONT_SIZE}
                        step={STEP_FONT_SIZE}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </fieldset>
    </form>
  );
}
