// src/app/(dashboard)/history/page.tsx
'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  AllocationResponse, // Para buscar as alocações atuais
} from '@/lib/schemas/allocation.schema'
import {
  FullSnapshotResponse,
  CreateAllocationSnapshot,
} from '@/lib/schemas/allocation-snapshot.schema' // Importar schemas de snapshot

const MOCK_CLIENT_ID = 'f815d174-c611-48d3-a363-8428f5f79ea1' // Use um ID de cliente válido

export default function HistoryPage() {
  const queryClient = useQueryClient()

  // 1. Query para buscar as alocações ATUAIS do cliente (necessário para criar um snapshot)
  const { data: currentAllocations, isLoading: isLoadingCurrentAllocations, isError: isErrorCurrentAllocations, error: errorCurrentAllocations } = useQuery<AllocationResponse[]>({
    queryKey: ['clientAllocations', MOCK_CLIENT_ID],
    queryFn: async () => {
      const response = await api.get(`/allocations/clients/${MOCK_CLIENT_ID}`)
      return response.data
    },
  })

  // 2. Query para buscar o HISTÓRICO de snapshots de alocações do cliente
  const { data: snapshots, isLoading: isLoadingSnapshots, isError: isErrorSnapshots, error: errorSnapshots } = useQuery<FullSnapshotResponse[]>({
    queryKey: ['clientSnapshots', MOCK_CLIENT_ID],
    queryFn: async () => {
      const response = await api.get(`/allocation-snapshots/clients/${MOCK_CLIENT_ID}`)
      return response.data
    },
  })

  // 3. Mutação para CRIAR um novo snapshot de alocações
  const createSnapshotMutation = useMutation({
    mutationFn: async (payload: CreateAllocationSnapshot) => {
      const response = await api.post('/allocation-snapshots', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientSnapshots', MOCK_CLIENT_ID] }) // Invalida o cache para recarregar a lista de snapshots
      alert('Snapshot de alocações criado com sucesso!')
    },
    onError: (err) => {
      console.error('Erro ao criar snapshot de alocações:', err)
      alert('Erro ao criar snapshot de alocações.')
    },
  })

  const handleCreateSnapshot = () => {
    if (!currentAllocations || currentAllocations.length === 0) {
      alert('Não há alocações atuais para criar um snapshot.')
      return
    }

    // Prepara os dados para o payload do snapshot
    const payload: CreateAllocationSnapshot = {
      clientId: MOCK_CLIENT_ID,
      date: new Date().toISOString(), // Data atual para o snapshot
      allocations: currentAllocations.map(alloc => ({
        allocationId: alloc.id,
        valueAtSnapshot: alloc.value,
      })),
    }

    createSnapshotMutation.mutate(payload)
  }

  if (isLoadingCurrentAllocations || isLoadingSnapshots) {
    return <p>Carregando histórico e alocações...</p>
  }

  if (isErrorCurrentAllocations) {
    return <p>Erro ao carregar alocações atuais: {errorCurrentAllocations?.message}</p>
  }

  if (isErrorSnapshots) {
    return <p>Erro ao carregar histórico de snapshots: {errorSnapshots?.message}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Histórico de Patrimônio</h1>
        <Button
          onClick={handleCreateSnapshot}
          disabled={createSnapshotMutation.isPending || isLoadingCurrentAllocations}
        >
          {createSnapshotMutation.isPending ? 'Criando Snapshot...' : 'Atualizar Patrimônio (Criar Snapshot)'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Snapshots de Alocações</CardTitle>
        </CardHeader>
        <CardContent>
          {snapshots && snapshots.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data do Snapshot</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((snapshot) => (
                  <TableRow key={String(snapshot.id)}>
                    <TableCell className="font-medium">
                      {format(new Date(snapshot.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(snapshot.totalValue))}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* TODO: Implementar modal ou navegação para ver detalhes do snapshot */}
                      <Button variant="ghost" size="sm">Ver Detalhes</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Nenhum snapshot de alocações encontrado. Crie um para começar a registrar o histórico!</p>
          )}
        </CardContent>
      </Card>

      {/* TODO: Adicionar a seção para o histórico de simulações aqui */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Simulações</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta seção será para listar e gerenciar o histórico de simulações.</p>
          {/* Conteúdo para histórico de simulações */}
        </CardContent>
      </Card>
    </div>
  )
}
