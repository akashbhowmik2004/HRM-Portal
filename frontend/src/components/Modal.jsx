import React from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className={`w-full ${maxWidth} rounded-lg bg-white dark:bg-[#151d2e] shadow-elevated overflow-hidden flex flex-col max-h-[90vh] border border-[#E3E7EB] dark:border-gray-800 transition-colors`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E7EB] dark:border-gray-800 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-[#202A35] dark:text-gray-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-md p-1.5 text-[#687482] hover:bg-[#F0F2F4] hover:text-[#202A35] dark:hover:bg-gray-800 dark:hover:text-gray-200 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[#E3E7EB] dark:border-gray-800 bg-[#F6F7F8] dark:bg-[#0c1222]/50 px-5 py-3 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal

