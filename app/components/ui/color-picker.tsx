import * as React from "react";
import {
  Button,
  ColorArea,
  ColorField,
  ColorSlider,
  ColorSwatch,
  ColorThumb,
  Dialog,
  DialogTrigger,
  Input,
  Label,
  Popover,
  ColorPicker as ReactAriaColorPicker,
  SliderOutput,
  SliderTrack,
} from "react-aria-components";
import type {
  Color,
  ColorPickerProps as ReactAriaColorPickerProps,
} from "react-aria-components";

export type ColorPickerProps = Pick<
  ReactAriaColorPickerProps,
  "defaultValue"
> & {
  onChange?: (value: string) => void;
  label: string;
};

export function ColorPicker(props: ColorPickerProps) {
  const onChange = React.useCallback(
    (value: Color) => {
      props?.onChange?.(value.toFormat("hsla").toString("hsla"));
    },
    [props],
  );

  return (
    <ReactAriaColorPicker defaultValue={props.defaultValue} onChange={onChange}>
      <DialogTrigger>
        <Button className="flex w-full items-center justify-between outline-none">
          <span>{props.label}</span>
          <ColorSwatch className="size-5 rounded-md shadow-md" />
        </Button>
        <Popover
          placement="top right"
          className="bg-sidebar border-border w-60 rounded-md border outline-none"
        >
          <Dialog className="flex h-[inherit] flex-col gap-2 space-y-1 overflow-auto p-4 outline-none">
            <ColorArea
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
              className="h-48 w-full shrink-0 rounded-md shadow-md"
            >
              <ColorThumb className="border-border size-5 rounded-full border-2 shadow-md" />
            </ColorArea>

            <ColorSlider channel="hue" colorSpace="hsb" className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-popover-foreground text-xs font-medium">
                  Hue
                </Label>
                <SliderOutput className="text-popover-foreground text-xs font-medium" />
              </div>
              <SliderTrack className="relative h-7 rounded-md">
                <ColorThumb className="border-border top-1/2 size-5 rounded-full border-2 shadow-md" />
              </SliderTrack>
            </ColorSlider>
            <ColorField className="space-y-1">
              <Label className="text-popover-foreground text-xs font-medium">
                Hex
              </Label>
              <Input className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            </ColorField>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </ReactAriaColorPicker>
  );
}
