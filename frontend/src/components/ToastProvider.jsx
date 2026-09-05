import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ToastCard = ({ toast, onRemove }) => {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    // Trigger animation in
    const timerIn = setTimeout(() => setIsShowing(true), 10)
    
    // Trigger auto-remove
    const timerOut = setTimeout(() => {
      setIsShowing(false)
      setTimeout(() => onRemove(toast.id), 300) // wait for animation out
    }, toast.duration)

    return () => {
      clearTimeout(timerIn)
      clearTimeout(timerOut)
    }
  }, [toast, onRemove])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />,
  }

  return (
    <div
      className={`pointer-events-auto flex w-80 max-w-sm items-center gap-3 rounded-xl border border-gray-100/80 dark:border-gray-800/50 bg-white/90 dark:bg-[#151d2e] p-4 shadow-elevated backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isShowing ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      role="alert"
    >
      <div className="shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
        {toast.message}
      </div>
      <button
        onClick={() => {
          setIsShowing(false)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
