import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
      <div className={`w-full ${maxWidth} rounded-2xl bg-white dark:bg-[#151d2e] shadow-elevated overflow-hidden flex flex-col max-h-[90vh] border border-gray-100/80 dark:border-gray-800/50 transition-colors animate-in fade-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-[#0c1222]/50 px-6 py-4 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
