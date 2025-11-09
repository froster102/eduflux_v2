import { Input } from '@heroui/input';
import React from 'react';

import { SearchIcon } from '@/components/Icons';

interface SearchBoxProps {
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  value: string;
}

export default function SearchBox({
  onValueChange,
  placeholder,
  value,
  className,
}: SearchBoxProps) {
  const [search, setSearch] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Input
      ref={inputRef}
      isClearable
      className={`max-w-lg ${className} h-full`}
      classNames={{
        inputWrapper:
          'focus:outline-none focus:ring-0 focus:ring-offset-0 data-[focus=true]:ring-0 data-[focus=true]:outline-none',
      }}
      labelPlacement="outside"
      placeholder={placeholder || 'Search here'}
      startContent={<SearchIcon />}
      value={search}
      variant="faded"
      onValueChange={(v) => {
        setSearch(v);
        onValueChange(v.trim());
      }}
    />
  );
}
