import { Input } from '@heroui/input';

import { SearchIcon } from '@/components/Icons';

interface SearchBoxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({
  value,
  onValueChange,
  placeholder,
  className,
}: SearchBoxProps) {
  return (
    <Input
      className={`max-w-lg ${className}`}
      labelPlacement="outside"
      placeholder={placeholder || 'Search here'}
      startContent={<SearchIcon />}
      type="email"
      value={value}
      variant="faded"
      onValueChange={onValueChange}
    />
  );
}
