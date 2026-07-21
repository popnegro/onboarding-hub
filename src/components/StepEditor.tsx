'use client'

import { useState } from 'react'
import { type OnboardingStep } from '@/lib/supabase'
import { ChevronDown, AlertCircle, Play } from 'lucide-react'

interface StepEditorProps {
  step: OnboardingStep
  onStatusChange: (newStatus: OnboardingStep['status']) => void
  onNotesChange: (notes: string) => void
  onBlockerChange: (blocker: string | null) => void
  isLoading?: boolean
  videoTitle?: string
}

const STATUS_COLORS: Record<OnboardingStep['status'], string> = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  verified: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS: Record<OnboardingStep['status'], string> = {
  not_started: 'No Iniciado',
  in_progress: 'En Progreso',
  completed: 'Completado',
  verified: 'Verificado',
}

export default function StepEditor({
  step,
  onStatusChange,
  onNotesChange,
  onBlockerChange,
  isLoading,
  videoTitle,
}: StepEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [notes, setNotes] = useState(step.notes || '')
  const [blocker, setBlocker] = useState(step.blocker_reason || '')
  const [showBlockerInput, setShowBlockerInput] = useState(!!step.blocker_reason)

  const handleStatusClick = (newStatus: OnboardingStep['status']) => {
    onStatusChange(newStatus)
  }

  const handleSaveNotes = () => {
    onNotesChange(notes)
  }

  const handleSaveBlocker = () => {
    onBlockerChange(blocker || null)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-pxsol-blue transition">
      {/* Header */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-pxsol-light transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm text-pxsol-gray font-semibold">Paso {step.step_number}</span>
            <h4 className="font-bold text-pxsol-dark">{step.title}</h4>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[step.status]}`}>
            {STATUS_LABELS[step.status]}
          </span>
          <ChevronDown
            size={20}
            className={`text-pxsol-gray transition ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Description */}
          {step.description && (
            <div>
              <p className="text-sm text-pxsol-gray">{step.description}</p>
            </div>
          )}

          {/* Video Link */}
          {videoTitle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-3">
              <Play size={18} className="text-pxsol-blue flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-pxsol-dark">{videoTitle}</p>
                <p className="text-xs text-pxsol-gray">Video asociado al paso</p>
              </div>
              <button className="ml-auto px-3 py-1 bg-pxsol-blue text-white rounded text-xs font-medium hover:bg-blue-700 transition">
                Enviar
              </button>
            </div>
          )}

          {/* Status Selector */}
          <div>
            <label className="block text-sm font-medium text-pxsol-dark mb-2">Estado</label>
            <div className="flex gap-2">
              {(['not_started', 'in_progress', 'completed', 'verified'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusClick(status)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded text-xs font-medium transition ${
                    step.status === status
                      ? STATUS_COLORS[status] + ' ring-2 ring-offset-2 ring-pxsol-blue'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Blocker Input */}
          <div>
            <button
              onClick={() => setShowBlockerInput(!showBlockerInput)}
              className="flex items-center space-x-2 text-sm font-medium text-pxsol-dark hover:text-pxsol-blue transition mb-2"
            >
              <AlertCircle size={16} />
              <span>{showBlockerInput ? 'Ocultar' : 'Agregar'} Bloqueador</span>
            </button>
            {showBlockerInput && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  placeholder="Ej: Esperando datos del cliente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pxsol-blue"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSaveBlocker}
                  disabled={isLoading}
                  className="px-3 py-1 bg-pxsol-blue text-white rounded text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Guardar Bloqueador
                </button>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium text-pxsol-dark mb-2">Notas Internas</label>
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar notas sobre el progreso..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pxsol-blue resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSaveNotes}
                disabled={isLoading}
                className="px-3 py-1 bg-pxsol-blue text-white rounded text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                Guardar Notas
              </button>
            </div>
          </div>

          {/* Dates */}
          {step.estimated_date && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-pxsol-gray">Fecha Estimada</p>
                <p className="text-pxsol-dark font-semibold">{step.estimated_date}</p>
              </div>
              {step.completed_date && (
                <div>
                  <p className="font-medium text-pxsol-gray">Completado</p>
                  <p className="text-green-600 font-semibold">{new Date(step.completed_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
