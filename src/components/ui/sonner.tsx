import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors
      closeButton={true}
      toastOptions={{
        classNames: {
          toast: "group toast p-4 rounded-xl border-none shadow-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest",
          success: "group-[.toaster]:bg-[#00E5A0] group-[.toaster]:text-black",
          error: "group-[.toaster]:bg-[#FF4444] group-[.toaster]:text-white",
          warning: "group-[.toaster]:bg-[#F5C842] group-[.toaster]:text-black",
          info: "group-[.toaster]:bg-[#2B86C5] group-[.toaster]:text-white",
          description: "group-[.toast]:text-current/60",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "left-auto right-2 top-2 border-none bg-transparent hover:bg-black/10",
        },
      }}
      duration={3000}
      {...props}
    />
  );
};

export { Toaster, toast };
