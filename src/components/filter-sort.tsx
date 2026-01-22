"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideSearch, LucideX } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterSort({
  url,
  title: initTitle,
  sort: initSort = "latest",
}: {
  url?: string;
  title?: string;
  sort?: string;
}) {
  const [title, setTitle] = useState(initTitle ?? "");
  const [sort, setSort] = useState(initSort ?? "latest");

  const router = useRouter();
  const pathname = usePathname();

  function onSubmit() {
    const searchParams = new URLSearchParams();

    if (title) {
      searchParams.set("title", title);
    }

    console.log(title);

    searchParams.set("sort", sort);

    router.push(`${url ?? pathname}?${searchParams.toString()}`);
  }

  useEffect(() => {
    onSubmit();
  }, [title, sort]);

  return (
    <div className="flex gap-4">
      <InputGroup>
        <InputGroupInput
          type="search"
          name="title"
          placeholder="Search"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <LucideSearch />
        </InputGroupAddon>
        {title && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="outline"
              size="icon-xs"
              onClick={() => setTitle("")}
            >
              <LucideX />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <Select
        onValueChange={(val: "latest" | "oldest" | "a-z" | "z-a") => {
          setSort(val);
        }}
        defaultValue="latest"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="a-z">A-Z</SelectItem>
          <SelectItem value="z-a">Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
