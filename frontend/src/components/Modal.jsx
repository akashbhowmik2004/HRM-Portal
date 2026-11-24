import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`w-full ${maxWidth} rounded-xl bg-white shadow-elevated overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] border border-[#E2E8E5] transition-colors dark:bg-[#151d2e] dark:border-gray-800 my-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8E5] px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-[#151d2e] dark:border-gray-800 shrink-0">
          <h3 className="text-sm font-semibold text-[#172B2A] dark:text-gray-100 truncate pr-2">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-md p-1.5 text-[#647572] hover:bg-[#EAF5F1] hover:text-[#172B2A] transition dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 shrink-0"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-white dark:bg-[#151d2e]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[#E2E8E5] bg-[#F8FAF9] px-4 py-3 sm:px-5 flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 dark:bg-[#0f172a] dark:border-gray-800 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal

