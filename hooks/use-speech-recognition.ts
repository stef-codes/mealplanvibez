"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechRecognitionHook {
  text: string
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  hasRecognitionSupport: boolean
  error: string | null
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  interface SpeechRecognition {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: (event: any) => void
    onerror: (event: any) => void
    onend: () => void
    start: () => void
    stop: () => void
  }
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [text, setText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setHasRecognitionSupport(true)
        const recognitionInstance = new SpeechRecognition()

        // Configure recognition
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        // Set up event handlers
        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("")

          setText(transcript)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setError(`Error: ${event.error}`)
          setIsListening(false)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [])

  const startListening = useCallback(() => {
    setText("")
    setError(null)

    if (recognition) {
      try {
        recognition.start()
        setIsListening(true)
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
        setError("Failed to start speech recognition. Please try again.")
      }
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition, isListening])

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error,
  }
}
