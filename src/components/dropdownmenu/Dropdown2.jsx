"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Dropdown2({ items }) {
  const [position, setPosition] = React.useState(Object.keys(items)[0]);

  // Define a function to determine the button size based on the screen size
  const getButtonSize = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      return "newvari2"; // For small screens
    }
    return "newvari"; // For all other screen sizes
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={getButtonSize()}>
          {items[position]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {Object.keys(items).map((keyname, i) => (
            <DropdownMenuRadioItem value={keyname} key={i}>
              {items[keyname]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
