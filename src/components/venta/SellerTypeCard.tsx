"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SellerTypeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  href: string;
  sellerType: string;
  onSelect: (sellerType: string, title: string, href: string) => void;
}

export function SellerTypeCard({
  icon: Icon,
  title,
  description,
  features,
  sellerType,
  onSelect,
  href,
}: SellerTypeCardProps) {
  return (
    <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary cursor-pointer group bg-card">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-10 h-10 text-primary" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-card-foreground mb-3">{title}</h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6">{description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-8 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-card-foreground">
              <svg
                className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className="w-full text-base py-6"
          onClick={() => onSelect(sellerType, title, href)}
        >
          Continuar
        </Button>
      </div>
    </Card>
  );
}
