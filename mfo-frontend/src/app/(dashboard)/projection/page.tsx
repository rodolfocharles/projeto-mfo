'use client'

import React, { useState } from 'react';
import { ProjectionResults } from '@/components/simulations/projection-results';
import { SimulationComparison } from '@/components/simulations/simulation-comparison';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api'; // Seu cliente Axios configurado
import {
  SimulationResponse,
  CreateSimulationForm,
  UpdateSimulationForm,
} from '@/lib/schemas/simulation.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SimulationForm } from '@/components/simulations/simulation-form';
import { toast } from 'sonner'; // Para notificações mais amigáveis

const MOCK_CLIENT_ID = 'f815d174-c611-48d3-a363-8428f5f79ea1'; // Use seu ID de cliente mockado

export default function ProjectionPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationResponse | null>(null);
  const [selectedSimulationForResults, setSelectedSimulationForResults] = useState<SimulationResponse | null>(null); // Para exibir resultados

  // Query para buscar as simulações do cliente
  const { data: simulations, isLoading, isError, error } = useQuery<SimulationResponse[]>({
    queryKey: ['clientSimulations', MOCK_CLIENT_ID],
    queryFn: async () => {
      const response = await api.get(`/simulations/clients/${MOCK_CLIENT_ID}`);
      return response.data;
    },
  });

  // Mutação para criar simulação
  const createSimulationMutation = useMutation({
    mutationFn: async (newSimulation: CreateSimulationForm) => {
      const payload = {
        ...newSimulation,
        clientId: MOCK_CLIENT_ID,
        startDate: new Date(newSimulation.startDate + 'T00:00:00').toISOString(), // Garante formato ISO
      };
      const response = await api.post('/simulations', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientSimulations', MOCK_CLIENT_ID] });
      setIsCreateModalOpen(false);
      toast.success('Simulação criada com sucesso!');
    },
    onError: (err) => {
      console.error('Erro ao criar simulação:', err);
      toast.error('Erro ao criar simulação.');
    },
  });

  // Mutação para editar simulação
  const updateSimulationMutation = useMutation({
    mutationFn: async (updatedSimulation: SimulationResponse) => {
      const payload: UpdateSimulationForm = {
        name: updatedSimulation.name,
        startDate: new Date(updatedSimulation.startDate).toISOString().split('T')[0], // Garante YYYY-MM-DD para o form
        realRate: updatedSimulation.realRate,
        inflation: updatedSimulation.inflation,
        lifeStatus: updatedSimulation.lifeStatus,
      };
      const response = await api.put(`/simulations/${updatedSimulation.id}`, {
        ...payload,
        startDate: new Date(payload.startDate + 'T00:00:00').toISOString(), // Converte de volta para ISO para o backend
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientSimulations', MOCK_CLIENT_ID] });
      setIsEditModalOpen(false);
      setSelectedSimulation(null);
      toast.success('Simulação atualizada com sucesso!');
    },
    onError: (err) => {
      console.error('Erro ao atualizar simulação:', err);
      toast.error('Erro ao atualizar simulação.');
    },
  });

  // Mutação para deletar simulação
  const deleteSimulationMutation = useMutation({
    mutationFn: async (simulationId: string) => {
      await api.delete(`/simulations/${simulationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientSimulations', MOCK_CLIENT_ID] });
      toast.success('Simulação excluída com sucesso!');
    },
    onError: (err) => {
      console.error('Erro ao excluir simulação:', err);
      toast.error('Erro ao excluir simulação.');
    },
  });

  const handleCreateSubmit = (data: CreateSimulationForm) => {
    createSimulationMutation.mutate(data);
  };

  const handleEditSubmit = (data: CreateSimulationForm) => {
    if (selectedSimulation) {
      const updatedSimulation: SimulationResponse = {
        ...selectedSimulation,
        name: data.name,
        startDate: new Date(data.startDate + 'T00:00:00').toISOString(), // Converte para ISO para a mutação
        realRate: data.realRate,
        inflation: data.inflation,
        lifeStatus: data.lifeStatus,
      };
      updateSimulationMutation.mutate(updatedSimulation);
    }
  };

  const handleDelete = (simulationId: string) => {
    deleteSimulationMutation.mutate(simulationId);
  };

  if (isLoading) {
    return <p>Carregando simulações...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar simulações: {error?.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Projeções</h1>
        <div className="flex space-x-2">
          <SimulationComparison availableSimulations={simulations || []} />
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>Criar Nova Simulação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Simulação</DialogTitle>
              </DialogHeader>
              <SimulationForm
                onSubmit={handleCreateSubmit}
                onCancel={() => setIsCreateModalOpen(false)}
                isSubmitting={createSimulationMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>  
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Simulações</CardTitle>
        </CardHeader>
        <CardContent>
          {simulations && simulations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Taxa Real</TableHead>
                  <TableHead>Inflação</TableHead>
                  <TableHead>Status Vida</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {simulations.map((simulation) => (
                  <TableRow key={simulation.id}>
                    <TableCell className="font-medium">{simulation.name}</TableCell>
                    <TableCell>{new Date(simulation.startDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{(simulation.realRate * 100).toFixed(2)}%</TableCell>
                    <TableCell>{(simulation.inflation * 100).toFixed(2)}%</TableCell>
                    <TableCell>
                      {simulation.lifeStatus === 'NORMAL' ? 'Normal' :
                        simulation.lifeStatus === 'RETIRED' ? 'Aposentado' :
                          'Falecido'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSimulationForResults(simulation)}
                      >
                        Ver Projeção
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSimulation(simulation);
                          setIsEditModalOpen(true);
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
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente a simulação &quot;{simulation.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(simulation.id)}>
                              {deleteSimulationMutation.isPending ? 'Excluindo...' : 'Excluir'}
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
            <p>Nenhuma simulação encontrada. Crie uma nova para começar!</p>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição de Simulação */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Simulação</DialogTitle>
          </DialogHeader>
          {selectedSimulation && (
            <SimulationForm
              initialData={selectedSimulation}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedSimulation(null);
              }}
              isSubmitting={updateSimulationMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Área de Exibição de Resultados da Projeção */}
      {selectedSimulationForResults && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Projeção: {selectedSimulationForResults.name}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSelectedSimulationForResults(null)}>
              Fechar Projeção
            </Button>
          </CardHeader>
          <CardContent>
            {/* Área de Exibição de Resultados da Projeção */}
            {selectedSimulationForResults && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Projeção: {selectedSimulationForResults.name}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSimulationForResults(null)}
                  >
                    Fechar Projeção
                  </Button>
                </div>

                {/* Buscar os dados de projeção do backend */}
                <ProjectionResults simulation={selectedSimulationForResults} />
              </div>
            )}

          </CardContent>
        </Card>
      )}
    </div>
  );
}
