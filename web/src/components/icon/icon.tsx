import { Add } from "./svgs/add";
import { BookMark } from "./svgs/bookmark";
import { Check } from "./svgs/check";
import { Close } from "./svgs/close";
import { Error } from "./svgs/error";
import { Flare } from "./svgs/flare";
import { H1 } from "./svgs/h1";
import { H2 } from "./svgs/h2";
import { h3 } from "./svgs/h3";
import { Home } from "./svgs/home";
import { Image } from "./svgs/image";
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
  check: Check,
  close: Close,
  image: Image,
  h1: H1,
  h2: H2,
  h3: h3,
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
