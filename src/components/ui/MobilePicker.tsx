import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobilePickerOption {
  label: string;
  value: string;
}

interface MobilePickerProps {
  options: MobilePickerOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const MobilePicker: React.FC<MobilePickerProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  title = "Select Option",
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold shadow-sm transition-colors hover:bg-white/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {/* On desktop, we could render a typical dropdown. But for this mobile-first overhaul, 
          we render the bottom sheet globally or conditionally. As per prompt, Native-feeling bottom sheet pickers on mobile. */}
      {/* We use BottomSheet which is naturally responsive or specific to mobile. */}
      <BottomSheet 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={title}
        height="50vh"
      >
        <div className="space-y-2 mt-4">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                  isSelected ? "bg-primary/20 text-primary border border-primary/20" : "bg-white/5 border border-transparent hover:bg-white/10 text-white"
                )}
              >
                <span className="font-bold">{option.label}</span>
                {isSelected && <Check className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </>
  );
};
