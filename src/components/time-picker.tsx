"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { updateUserProfile } from "@/lib/actions/update-user-profile";

type TimePickerProps = {
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  use12Format: boolean;
};

export default function TimePicker({
  className,
  value,
  onChange,
  use12Format,
}: TimePickerProps) {
  const [time, setTime] = useState<Date | undefined>(value);
  const [is12hour, setIs12Hour] = useState(use12Format);
  const [open, setOpen] = useState(false);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setTime(value);
    }
  }, [value]);

  const hours = useMemo(() => {
    if (is12hour) {
      return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)).toSorted(
        (a, b) => b - a,
      );
    }
    return Array.from({ length: 24 }, (_, i) => i).toSorted((a, b) => b - a);
  }, [is12hour]);

  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (value: string) => {
    const newTime = time ? new Date(time) : new Date();
    let hour = Number.parseInt(value, 10);

    if (is12hour && time && getAmPm(time) === "PM" && hour !== 12) {
      hour += 12;
    } else if (is12hour && time && getAmPm(time) === "AM" && hour === 12) {
      hour = 0;
    }

    newTime.setHours(hour);
    updateTime(newTime);
  };

  const handleMinuteChange = (value: string) => {
    const newTime = time ? new Date(time) : new Date();
    newTime.setMinutes(Number.parseInt(value, 10));
    updateTime(newTime);
  };

  const handleAmPmChange = (value: string) => {
    if (!time) return;

    const newTime = new Date(time);
    const currentHour = newTime.getHours();

    if (value === "AM" && currentHour >= 12) {
      newTime.setHours(currentHour - 12);
    } else if (value === "PM" && currentHour < 12) {
      newTime.setHours(currentHour + 12);
    }

    updateTime(newTime);
  };

  const updateTime = (newTime: Date) => {
    setTime(newTime);
    onChange?.(newTime);
  };

  const getAmPm = (date: Date) => {
    return date.getHours() >= 12 ? "PM" : "AM";
  };

  const getFormattedTime = (date: Date) => {
    if (is12hour) {
      return format(date, "hh:mm a");
    }
    return format(date, "HH:mm");
  };

  const getCurrentHour = () => {
    if (!time) return "";

    if (is12hour) {
      const hour = time.getHours() % 12;
      return (hour === 0 ? 12 : hour).toString();
    }

    return time.getHours().toString();
  };

  const getCurrentMinute = () => {
    if (!time) return "";
    return time.getMinutes().toString().padStart(2, "0");
  };

  const getCurrentAmPm = () => {
    if (!time) return "AM";
    return getAmPm(time);
  };

  const handleCheckedChange = async (checked: boolean) => {
    setIs12Hour(checked);
    try {
      await updateUserProfile({ is_12h: checked });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time ? getFormattedTime(time) : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="12-hour-mode">12-hour mode</Label>
            <Switch
              id="12-hour-mode"
              checked={is12hour}
              onCheckedChange={handleCheckedChange}
            />
          </div>

          <div className="flex space-x-2">
            <Select value={getCurrentHour()} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {is12hour ? hour.toString().padStart(2, "0") : hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={getCurrentMinute()}
              onValueChange={handleMinuteChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((minute) => (
                  <SelectItem
                    key={minute}
                    value={minute.toString().padStart(2, "0")}
                  >
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {is12hour && (
              <Select value={getCurrentAmPm()} onValueChange={handleAmPmChange}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
