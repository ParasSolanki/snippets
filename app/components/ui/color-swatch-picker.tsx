import * as React from "react";
import {
  ColorSwatch,
  ColorSwatchPickerItem,
  parseColor,
  ColorSwatchPicker as ReactAriaColorSwatchPicker,
} from "react-aria-components";
import type { Color } from "react-aria-components";

export type ColorSwatchPickerProps = {
  colors: string[];
  onChange: (color: string) => void;
};

export function ColorSwatchPicker({
  colors,
  onChange,
}: ColorSwatchPickerProps) {
  const handleOnChange = React.useCallback(
    (color: Color) => {
      onChange(color.toFormat("hsla").toString("hsla"));
    },
    [onChange],
  );

  return (
    <ReactAriaColorSwatchPicker
      className="flex flex-wrap gap-2"
      onChange={handleOnChange}
    >
      {colors.map((color, index) => (
        <ColorSwatchPickerItem
          key={`${color}-${index}`}
          color={color}
          className="data-selected:after:outline-accent-foreground data-selected:after:border-border relative w-fit rounded-md forced-color-adjust-none outline-none data-selected:after:absolute data-selected:after:inset-0 data-selected:after:rounded-[inherit] data-selected:after:border-2 data-selected:after:outline-2 data-selected:after:outline-offset-[-2px]"
        >
          <ColorSwatch className="inset-0 size-5 rounded-md shadow" />
        </ColorSwatchPickerItem>
      ))}
    </ReactAriaColorSwatchPicker>
  );
}

type LinearGradientColor = {
  start: string;
  end: string;
};

export type LinearGradientColorSwatchPickerProps = {
  colors: Array<LinearGradientColor>;
  onChange: (color: LinearGradientColor) => void;
};

export function LinearGradientColorSwatchPicker({
  colors,
  onChange,
}: LinearGradientColorSwatchPickerProps) {
  const [selectedColorIndex, setSelectedColorIndex] = React.useState<
    number | undefined
  >(undefined);

  const _colors = React.useMemo(() => {
    return colors.map((color) => {
      return {
        start: parseColor(color.start).toFormat("hsla").toString("hsla"),
        end: parseColor(color.end).toFormat("hsla").toString("hsla"),
      };
    });
  }, [colors]);

  const handleOnChange = React.useCallback(
    (index: number) => {
      if (index === undefined) return;
      const color = _colors[index];

      if (!color) return;

      onChange(color);
      setSelectedColorIndex(index);
    },
    [onChange, _colors],
  );

  return (
    <div
      tabIndex={-1}
      role="listbox"
      aria-label="Linear grdient color swatches"
      className="flex flex-wrap gap-2"
    >
      {_colors.map((color, index) => (
        <LinearGradientColorSwatchPickerItem
          key={index}
          color={color}
          selected={selectedColorIndex === index}
          onSelect={() => handleOnChange(index)}
          onKeyDown={(e) => {
            if (selectedColorIndex === undefined) return;
            if (e.key === "Enter") handleOnChange(index);
            else if (e.key === "ArrowRight") {
              handleOnChange(
                selectedColorIndex === _colors.length - 1
                  ? 0
                  : selectedColorIndex + 1,
              );
            } else if (e.key === "ArrowLeft") {
              handleOnChange(
                selectedColorIndex === 0
                  ? _colors.length - 1
                  : selectedColorIndex - 1,
              );
            }
          }}
        />
      ))}
    </div>
  );
}

function LinearGradientColorSwatchPickerItem({
  color,
  selected,
  onSelect,
  onKeyDown,
}: {
  color: LinearGradientColor;
  selected: boolean;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      tabIndex={selected ? 0 : -1}
      role="option"
      aria-label=""
      aria-selected={selected ? true : undefined}
      data-selected={selected ? true : undefined}
      className="data-selected:after:outline-accent-foreground data-selected:after:border-border relative w-fit rounded-md forced-color-adjust-none outline-none data-selected:after:absolute data-selected:after:inset-0 data-selected:after:rounded-[inherit] data-selected:after:border-2 data-selected:after:outline-2 data-selected:after:outline-offset-[-2px]"
      onClick={() => onSelect()}
      onKeyDown={(e) => onKeyDown(e)}
    >
      <div
        role="img"
        aria-label=""
        className="inset-0 size-5 rounded-md shadow forced-color-adjust-none"
        aria-roledescription="color swatch"
        style={{
          background: `linear-gradient(to right, ${color.start}, ${color.end})`,
        }}
      />
    </div>
  );
}
