"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SpeechInputProps {
  onTextCaptured: (text: string) => void
  className?: string
}

export function SpeechInput({ onTextCaptured, className = "" }: SpeechInputProps) {
  const { text, isListening, startListening, stopListening, hasRecognitionSupport, error } = useSpeechRecognition()
  const [showUnsupportedAlert, setShowUnsupportedAlert] = useState(false)

  // When text changes and we have content, pass it to the parent
  useEffect(() => {
    if (text && !isListening) {
      onTextCaptured(text)
    }
  }, [text, isListening, onTextCaptured])

  // Show unsupported alert if speech recognition is not supported
  useEffect(() => {
    if (!hasRecognitionSupport) {
      setShowUnsupportedAlert(true)
    }
  }, [hasRecognitionSupport])

  const handleToggleListening = () => {
    if (!hasRecognitionSupport) {
      setShowUnsupportedAlert(true)
      return
    }

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className={className}>
      {showUnsupportedAlert && !hasRecognitionSupport && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={handleToggleListening}
          disabled={!hasRecognitionSupport}
          className="h-10 w-10 rounded-full"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <div className="flex-1">
          {isListening ? (
            <div className="text-sm font-medium text-green-600 animate-pulse">Listening...</div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {hasRecognitionSupport ? "Click the microphone to speak" : "Speech recognition not supported"}
            </div>
          )}
        </div>
      </div>

      {isListening && text && (
        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">Recognized text:</p>
          <p className="mt-1">{text}</p>
        </div>
      )}
    </div>
  )
}
