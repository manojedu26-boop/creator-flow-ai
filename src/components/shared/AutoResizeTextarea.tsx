import React, { useRef, useEffect } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

export const AutoResizeTextarea = ({ className, maxLength, value, defaultValue, onChange, ...props }: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [contentLength, setContentLength] = React.useState(
    (value || defaultValue || '').toString().length
  );

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    resize();
    // Add a small delay for initial render parsing
    setTimeout(resize, 100);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [value, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentLength(e.target.value.length);
    resize();
    if (onChange) onChange(e);
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        maxLength={maxLength}
        className={`${className} overflow-hidden`}
        {...props}
      />
      {maxLength && (
        <div className="absolute bottom-4 right-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          {contentLength} / {maxLength}
        </div>
      )}
    </div>
  );
};
