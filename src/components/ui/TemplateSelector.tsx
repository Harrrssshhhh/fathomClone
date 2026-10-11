import type { SummaryTemplate } from '../../types';

const TEMPLATES: { value: SummaryTemplate; label: string }[] = [
  { value: 'standard',    label: 'Standard' },
  { value: 'executive',   label: 'Executive' },
  { value: 'sales',       label: 'Sales Call' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'interview',   label: 'Interview' },
];

interface TemplateSelectorProps {
  value: SummaryTemplate;
  onChange: (t: SummaryTemplate) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TEMPLATES.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            value === t.value
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
