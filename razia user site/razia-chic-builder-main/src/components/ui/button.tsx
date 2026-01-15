import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium brand variants with arc-inspired styling
        gold: "bg-gold text-gold-foreground hover:bg-gold/90 shadow-sm hover:shadow-md",
        teal: "bg-teal text-white hover:bg-teal/90 shadow-sm hover:shadow-md",
        coral: "bg-coral text-coral-foreground hover:bg-coral/90 shadow-sm hover:shadow-md",
        // Gradient variants inspired by the layered arc shapes
        "gradient-gold": "bg-gradient-to-r from-gold via-gold/90 to-sand text-gold-foreground shadow-sm hover:shadow-lg hover:scale-[1.02]",
        "gradient-teal": "bg-gradient-to-r from-teal via-teal/90 to-primary text-white shadow-sm hover:shadow-lg hover:scale-[1.02]",
        "gradient-coral": "bg-gradient-to-r from-coral via-coral/90 to-coral/70 text-coral-foreground shadow-sm hover:shadow-lg hover:scale-[1.02]",
        // Premium outline variants
        "outline-gold": "border-2 border-gold text-gold bg-transparent hover:bg-gold hover:text-gold-foreground",
        "outline-teal": "border-2 border-teal text-teal bg-transparent hover:bg-teal hover:text-white",
        "outline-coral": "border-2 border-coral text-coral bg-transparent hover:bg-coral hover:text-coral-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
