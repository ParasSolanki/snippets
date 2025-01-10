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
  "shadow-opacity": z.number().min(2, {
    message: "shadow-opacity must be at least 2 characters.",
  }),
  "shadow-offset-y": z.number().min(2, {
    message: "shadow-offset-y must be at least 2 characters.",
  }),
  "shadow-blur": z.number().min(2, {
    message: "shadow-blur must be at least 2 characters.",
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
      "shadow-opacity": 0,
      "shadow-offset-y": 0,
      "shadow-blur": 0,
      "font-family": "ibm-plex-mono",
      "font-size": 0,
    },
  });

  const paddingY = form.watch("layout-padding-y");
  const paddingX = form.watch("layout-padding-x");
  const width = form.watch("layout-width");
  const backgroundType = form.watch("background-type");
  const backgroundColor = form.watch("background-color");
  const backgroundColorEnd = form.watch("background-color-end");
  const backgroundDirection = form.watch("background-direction");
  const language = form.watch("language");
  const theme = form.watch("theme");

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
              <FormField
                control={form.control}
                name="background-color"
                render={({ field }) => (
                  <FormItem>
                    <ColorPicker
                      label={`${backgroundType === "linear-gradient" ? "Color Start" : "Color"}`}
                      defaultValue={field.value}
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
                        defaultValue={field.value}
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
              <FormField
                control={form.control}
                name="shadow-opacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opacity</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
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
                    <FormLabel>Offset Y</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
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
                    <FormLabel>Blur</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
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
                        <SelectItem value="ibm-plex-mono">
                          IBM Plex Mono
                        </SelectItem>
                        <SelectItem value="geist-mono">Geist Mono</SelectItem>
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
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
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
        </Accordion>
      </fieldset>
    </form>
  );
}
