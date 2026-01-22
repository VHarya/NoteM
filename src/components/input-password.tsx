import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { LucideEye, LucideEyeOff } from "lucide-react";

export default function InputPassword({ ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type={showPassword ? "text" : "password"}
        placeholder="************"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <LucideEye /> : <LucideEyeOff />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
