import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };

export function Avatar({ name, color, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
