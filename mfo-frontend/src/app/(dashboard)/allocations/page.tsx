// src/app/(dashboard)/allocations/page.tsx
'use client'
//CORREÇÃO AQUI: Adicione useEffect à importação do React
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { AllocationResponse, CreateAllocationForm } from '@/lib/schemas/allocation.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { AllocationForm } from '@/components/allocations/allocation-form'

const MOCK_CLIENT_ID = 'fc476bb9-3f05-47c3-968d-0098d289f3ba'

export default function AllocationsPage() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAllocation, setSelectedAllocation] = useState<AllocationResponse | null>(null)

  // Query para buscar as alocações (sem alterações aqui)
  const { data: allocations, isLoading, isError, error } = useQuery<AllocationResponse[]>({
    queryKey: ['clientAllocations', MOCK_CLIENT_ID],
    queryFn: async () => {
      const response = await api.get(`/allocations/clients/${MOCK_CLIENT_ID}`)
      return response.data
    },
  })

  // Mutação para criar alocação
  const createAllocationMutation = useMutation({
    mutationFn: async (newAllocation: CreateAllocationForm) => {
      // CORREÇÃO AQUI: Converte a data do formulário para ISO string
      const isoStartDate = new Date(newAllocation.date + 'T00:00:00').toISOString()
      const payload = {
        name: newAllocation.name,
        type: newAllocation.type,
        value: newAllocation.value,
        startDate: isoStartDate, // ✅ Agora envia no formato ISO completo
        clientId: MOCK_CLIENT_ID,
        // Se o backend espera contribution, rate, isTaxable no POST, adicione aqui com valores padrão ou do formulário
        contribution: 0,
        rate: 0,
        isTaxable: false,
      }
      const response = await api.post('/allocations', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAllocations', MOCK_CLIENT_ID] })
      setIsCreateModalOpen(false)
      alert('Alocação criada com sucesso!')
    },
    onError: (err) => {
      console.error('Erro ao criar alocação:', err)
      alert('Erro ao criar alocação.')
    },
  })

  // Mutação para editar alocação
  const updateAllocationMutation = useMutation({
    mutationFn: async (updatedAllocation: AllocationResponse) => {
      console.log('Tentando enviar PUT para o backend com payload:', updatedAllocation)
      // Converte a data do formulário para ISO string
      // O initialData já tem startDate em ISO, mas o formulário retorna YYYY-MM-DD
      // Então, precisamos pegar a data do formulário (que vem de handleEditSubmit)
      // e converter para ISO novamente.
      // A função handleEditSubmit já faz isso, então aqui só precisamos garantir que o payload
      // está usando o startDate já convertido.
      const payload = {
        name: updatedAllocation.name,
        type: updatedAllocation.type,
        value: updatedAllocation.value,
        startDate: updatedAllocation.startDate, // Já deve estar em ISO vindo de handleEditSubmit
        // Se o backend espera contribution, rate, isTaxable no PUT, adicione aqui
        clientId: MOCK_CLIENT_ID, //Adicionei clientId aqui também para o PUT, se o backend esperar
        contribution: updatedAllocation.contribution || 0,
        rate: updatedAllocation.rate || 0,
        isTaxable: updatedAllocation.isTaxable || false,
      }
      const response = await api.put(`/allocations/${updatedAllocation.id}`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAllocations', MOCK_CLIENT_ID] })
      setIsEditModalOpen(false)
      setSelectedAllocation(null)
      alert('Alocação atualizada com sucesso!')
    },
    onError: (err) => {
      console.error('Erro ao atualizar alocação:', err)
      alert('Erro ao atualizar alocação.')
    },
  })

  const deleteAllocationMutation = useMutation({
    mutationFn: async (allocationId: string) => {
      await api.delete(`/allocations/${allocationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAllocations', MOCK_CLIENT_ID] })
      alert('Alocação excluída com sucesso!')
    },
    onError: (err) => {
      console.error('Erro ao excluir alocação:', err)
      alert('Erro ao excluir alocação.')
    },
  })

  //Logs para depuração do estado das mutações 
  useEffect(() => {
    console.log('Page - updateAllocationMutation.isPending:', updateAllocationMutation.isPending)
    console.log('Page - createAllocationMutation.isPending:', createAllocationMutation.isPending)
    console.log('Page - deleteAllocationMutation.isPending:', deleteAllocationMutation.isPending)
  }, [updateAllocationMutation.isPending, createAllocationMutation.isPending, deleteAllocationMutation.isPending])


  const handleCreateSubmit = (data: CreateAllocationForm) => {
    createAllocationMutation.mutate(data)
  }

  const handleEditSubmit = (data: CreateAllocationForm) => {
    //console.log('handleEditSubmit acionado com dados do formulário:', data);
    if (selectedAllocation) {
      //CORREÇÃO AQUI: Converte a data do formulário para ISO string antes de passar para a mutação
      const isoStartDate = new Date(data.date + 'T00:00:00').toISOString();
      const updatedAllocation: AllocationResponse = {
        ...selectedAllocation,
        name: data.name,
        type: data.type,
        value: data.value,
        startDate: isoStartDate, //Agora o selectedAllocation para a mutação tem a data ISO
      }
      console.log('Chamando updateAllocationMutation.mutate com:', updatedAllocation);
      updateAllocationMutation.mutate(updatedAllocation)
    } else {
      console.warn('selectedAllocation é nulo ao tentar editar.');
    }
  }

  const handleDelete = (allocationId: string) => {
    deleteAllocationMutation.mutate(allocationId)
  }

  if (isLoading) {
    return <p>Carregando alocações...</p>
  }
  if (isError) {
    return <p>Erro ao carregar alocações: {error?.message}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Alocações</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Nova Alocação</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Alocação</DialogTitle>
            </DialogHeader>
            <AllocationForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setIsCreateModalOpen(false)}
              isSubmitting={createAllocationMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Alocações</CardTitle>
        </CardHeader>
        <CardContent>
          {allocations && allocations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-medium">{allocation.name}</TableCell>
                    <TableCell>
                      {/* ADICIONE ESTE CONSOLE.LOG AQUI */}
                      {console.log('Tipo da alocação:', allocation.type)}
                      {allocation.type === 'FINANCIAL' ? 'Financeira' :
                      allocation.type === 'IMMOBILIZED' ? 'Imobilizada' :
                      'Desconhecido'}
                    </TableCell>
                    <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(allocation.value)}</TableCell>
                    <TableCell>
                      {allocation.startDate && new Date(allocation.startDate).toString() !== 'Invalid Date'
                        ? new Date(allocation.startDate).toLocaleDateString('pt-BR')
                        : 'Data Inválida'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedAllocation(allocation)
                          setIsEditModalOpen(true)
                        }}
                      >
                        Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Excluir</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente a alocação &quot;{allocation.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(allocation.id)}>
                              {deleteAllocationMutation.isPending ? 'Excluindo...' : 'Excluir'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Nenhuma alocação encontrada. Adicione uma nova!</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Alocação</DialogTitle>
          </DialogHeader>
          {selectedAllocation && (
            <AllocationForm
              initialData={selectedAllocation}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false)
                setSelectedAllocation(null)
              }}
              isSubmitting={updateAllocationMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
