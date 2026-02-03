import { Add } from "./svgs/add";
import { BookMark } from "./svgs/bookmark";
import { Error } from "./svgs/error";
import { Flare } from "./svgs/flare";
import { Home } from "./svgs/home";
import { Person } from "./svgs/person";
import { Profile } from "./svgs/profile";
import { Sort } from "./svgs/sort";
import { Success } from "./svgs/success";
import { Toggle } from "./svgs/toggle";

const icons = {
  flare: Flare,
  person: Person,
  book: BookMark,
  home: Home,
  add: Add,
  profile: Profile,
  sort: Sort,
  success: Success,
  error: Error,
  toggle: Toggle,
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
