"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

interface PasswordGeneratorInputProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  onGenerate?: (password: string) => void;
  label?: string;
  required?: boolean;
}

export function PasswordGeneratorInput({
  name,
  value,
  onChange,
  onGenerate,
  label = "Password",
  required = false,
}: PasswordGeneratorInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    if (onGenerate) {
      onGenerate(password);
    }
    if (onChange) {
      onChange(password);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Enter password or generate"
            required={required}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>

        <Button type="button" variant="outline" onClick={generatePassword}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate
        </Button>
      </div>
    </div>
  );
}
