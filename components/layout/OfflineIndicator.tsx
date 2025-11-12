'use client'
import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSync, setPendingSync] = useState(0)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all
        ${isOnline 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
        }
      `}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Online</span>
          {pendingSync > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
              {pendingSync} pending
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </>
      )}
    </div>
  )
}