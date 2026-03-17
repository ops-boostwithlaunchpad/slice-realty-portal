'use client'

import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'
import { Deal } from '@/lib/types'
import { DUMMY_DEALS } from '@/lib/dummy'

const STAGES = [
  { id: 'prospect', label: 'Prospects', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'appointment', label: 'Appointments', color: '#D97706', bg: '#FFFBEB' },
  { id: 'pending', label: 'Pending Sales', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'sold', label: 'Sold', color: '#16A34A', bg: '#F0FDF4' },
]

type BoardData = Record<string, Deal[]>

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}mo ago`
  }

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-xl border border-gray-100 p-3 mb-2 select-none"
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.15)'
              : '0 1px 3px rgba(0,0,0,0.05)',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            borderLeft: '3px solid #C41E2A',
          }}
        >
          {/* Client Name */}
          <p className="text-sm font-bold text-gray-900 mb-1">
            {deal.clients?.name ?? 'Unknown Client'}
          </p>

          {/* Property Address */}
          {deal.property_address && (
            <p className="text-xs text-gray-400 leading-tight mb-1.5">{deal.property_address}</p>
          )}

          {/* Notes */}
          {deal.notes && (
            <div className="mb-1.5 rounded-lg px-2.5 py-1.5" style={{ backgroundColor: '#F9FAFB' }}>
              <p className="text-xs text-gray-500 leading-tight line-clamp-2">{deal.notes}</p>
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-400">{timeAgo(deal.updated_at)}</span>
            {deal.offer_amount && (
              <span className="text-xs font-semibold" style={{ color: '#C41E2A' }}>
                ${deal.offer_amount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function buildBoard(deals: Deal[]): BoardData {
  const grouped: BoardData = { prospect: [], appointment: [], pending: [], sold: [] }
  for (const deal of deals) {
    const stage = deal.stage in grouped ? deal.stage : 'prospect'
    grouped[stage].push(deal)
  }
  return grouped
}

export default function PipelinePage() {
  const [board, setBoard] = useState<BoardData>(buildBoard(DUMMY_DEALS))

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceStage = source.droppableId
    const destStage = destination.droppableId

    const newBoard = { ...board }
    const sourceItems = Array.from(newBoard[sourceStage])
    const [movedItem] = sourceItems.splice(source.index, 1)
    const destItems =
      sourceStage === destStage ? sourceItems : Array.from(newBoard[destStage])
    destItems.splice(destination.index, 0, { ...movedItem, stage: destStage })

    newBoard[sourceStage] = sourceItems
    if (sourceStage !== destStage) {
      newBoard[destStage] = destItems
    } else {
      newBoard[sourceStage] = destItems
    }

    setBoard(newBoard)
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Pipeline
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Drag cards between columns to update deal stages
        </p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
            {STAGES.map((stage) => (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl flex-1 min-w-[240px]"
                style={{
                  backgroundColor: '#F8F8F7',
                  border: '1px solid #EBEBEB',
                }}
              >
                {/* Column header */}
                <div className="px-3 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm font-semibold text-gray-800">{stage.label}</span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: stage.bg, color: stage.color }}
                  >
                    {board[stage.id]?.length ?? 0}
                  </span>
                </div>

                {/* Cards */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 px-2 pb-2 overflow-y-auto"
                      style={{
                        minHeight: 100,
                        backgroundColor: snapshot.isDraggingOver ? '#F0F0EE' : 'transparent',
                        borderRadius: '0 0 16px 16px',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {board[stage.id]?.map((deal, index) => (
                        <DealCard key={deal.id} deal={deal} index={index} />
                      ))}
                      {provided.placeholder}
                      {board[stage.id]?.length === 0 && (
                        <div className="flex items-center justify-center h-20 text-xs text-gray-400">
                          No deals
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
    </div>
  )
}
