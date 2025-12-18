// src/components/simulations/simulation-comparison.tsx
'use client'

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  SimulationResponse,
  CompareSimulationResponse,
} from '@/lib/schemas/simulation.schema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface SimulationComparisonProps {
  availableSimulations: SimulationResponse[];
}

// Formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatar data para o eixo X
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' });
};

export function SimulationComparison({ availableSimulations }: SimulationComparisonProps) {
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedSimId1, setSelectedSimId1] = useState<string | null>(null);
  const [selectedSimId2, setSelectedSimId2] = useState<string | null>(null);

  // Query para buscar os dados de comparação
  const {
    data: comparisonData,
    isLoading: isLoadingComparison,
    isError: isErrorComparison,
    error: comparisonError,
    refetch,
  } = useQuery<CompareSimulationResponse>({
    queryKey: ['simulationComparison', selectedSimId1, selectedSimId2],
    queryFn: async () => {
      if (!selectedSimId1 || !selectedSimId2) {
        throw new Error('Selecione duas simulações para comparar.');
      }
      const response = await api.get(`/simulations/compare?id1=${selectedSimId1}&id2=${selectedSimId2}&months=360`);
      return response.data;
    },
    enabled: !!selectedSimId1 && !!selectedSimId2 && isComparisonModalOpen, // Só executa quando ambos IDs são selecionados e o modal está aberto
    staleTime: Infinity, // Dados de comparação não mudam frequentemente
  });

  const handleCompare = () => {
    if (!selectedSimId1 || !selectedSimId2) {
      toast.error('Por favor, selecione duas simulações para comparar.');
      return;
    }
    if (selectedSimId1 === selectedSimId2) {
      toast.error('Selecione simulações diferentes para comparar.');
      return;
    }
    refetch(); // Força a busca dos dados de comparação
  };

  const handleCloseModal = () => {
    setIsComparisonModalOpen(false);
    setSelectedSimId1(null);
    setSelectedSimId2(null);
  };

  // Filtrar simulações para evitar comparar uma com ela mesma na segunda seleção
  const availableSimulations2 = availableSimulations.filter(
    (sim) => sim.id !== selectedSimId1
  );

  // Preparar dados para exibição (filtrar anualmente para a tabela)
  const annualComparisonData = comparisonData?.comparison.filter((item, index) => index % 12 === 0);

  return (
    <Dialog open={isComparisonModalOpen} onOpenChange={setIsComparisonModalOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Comparar Simulações</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Comparar Simulações</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sim1" className="block text-sm font-medium text-gray-700">
                Simulação 1
              </label>
              <Select onValueChange={setSelectedSimId1} value={selectedSimId1 || ''}>
                <SelectTrigger id="sim1">
                  <SelectValue placeholder="Selecione a primeira simulação" />
                </SelectTrigger>
                <SelectContent>
                  {availableSimulations.map((sim) => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.name} (v{sim.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="sim2" className="block text-sm font-medium text-gray-700">
                Simulação 2
              </label>
              <Select onValueChange={setSelectedSimId2} value={selectedSimId2 || ''}>
                <SelectTrigger id="sim2">
                  <SelectValue placeholder="Selecione a segunda simulação" />
                </SelectTrigger>
                <SelectContent>
                  {availableSimulations2.map((sim) => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.name} (v{sim.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleCompare}
            disabled={!selectedSimId1 || !selectedSimId2 || selectedSimId1 === selectedSimId2 || isLoadingComparison}
            className="w-full"
          >
            {isLoadingComparison ? 'Comparando...' : 'Comparar'}
          </Button>

          {isLoadingComparison && <p className="text-center">Carregando comparação...</p>}
          {isErrorComparison && (
            <p className="text-center text-red-500">
              Erro ao comparar simulações: {comparisonError?.message}
            </p>
          )}

          {comparisonData && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados da Comparação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      {comparisonData.simulation1.name} (v{comparisonData.simulation1.version})
                    </h3>
                    <p className="text-sm text-gray-600">Taxa Real: {(comparisonData.simulation1.realRate * 100).toFixed(2)}%</p>
                    <p className="text-sm text-gray-600">Inflação: {(comparisonData.simulation1.inflation * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">
                      {comparisonData.simulation2.name} (v{comparisonData.simulation2.version})
                    </h3>
                    <p className="text-sm text-gray-600">Taxa Real: {(comparisonData.simulation2.realRate * 100).toFixed(2)}%</p>
                    <p className="text-sm text-gray-600">Inflação: {(comparisonData.simulation2.inflation * 100).toFixed(2)}%</p>
                  </div>
                </div>

                <h4 className="text-md font-semibold mb-2">Evolução do Patrimônio (Anual)</h4>
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Período</TableHead>
                        <TableHead className="text-right">{comparisonData.simulation1.name}</TableHead>
                        <TableHead className="text-right">{comparisonData.simulation2.name}</TableHead>
                        <TableHead className="text-right">Diferença</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {annualComparisonData?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.simulation1.balance)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.simulation2.balance)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              item.difference.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(item.difference.balance)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Aqui você poderia adicionar gráficos de comparação, se desejar */}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
