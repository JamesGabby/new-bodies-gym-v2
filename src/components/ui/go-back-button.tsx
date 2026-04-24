'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GoBackButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="w-full sm:w-auto"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Go Back
    </Button>
  )
}
