"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      router.push(`/propiedades?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
        <Search className="absolute left-4 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Ingresa una dirección, colonia, ciudad o código postal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 pl-12 pr-4 py-6 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          size="lg"
          className="m-2 px-8 bg-blue-600 hover:bg-blue-700"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
