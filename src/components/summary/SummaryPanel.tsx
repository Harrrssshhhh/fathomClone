import { useState } from 'react';
import type { Summary } from '../../types';

interface SummaryPanelProps {
  summary: Summary;
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(summary.sections.map(s => s.title))
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-lg p-4">
        <p className="text-sm text-brand-900 dark:text-brand-200 leading-relaxed">{summary.overview}</p>
      </div>

      {/* Sections */}
      {summary.sections.map(section => (
        <div key={section.title} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => toggleSection(section.title)}
          >
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{section.title}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.has(section.title) ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.has(section.title) && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
              <div className="pt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
