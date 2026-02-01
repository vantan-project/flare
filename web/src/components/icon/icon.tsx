import { BookMark } from "./svgs/bookmark";
import { Flare } from "./svgs/flare";
import { Person } from "./svgs/person";

const icons = {
  flare: Flare,
  person: Person,
  book: BookMark,
} as const;

export type IconProps = {
  size: number;
  name: keyof typeof icons;
};

export function Icon({ size, name }: IconProps) {
  const IconComponent = icons[name];
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      <IconComponent />
    </div>
  );
}
