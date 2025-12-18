// src/components/simulations/projection-results.tsx
'use client'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SimulationResponse, ProjectionItem } from '@/lib/schemas/simulation.schema';
import { ProjectionChart } from './projection-chart';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectionResultsProps {
  simulation: SimulationResponse;
}

export function ProjectionResults({ simulation }: ProjectionResultsProps) {
  // Query para buscar os dados de projeção do backend
  const { data: projectionData, isLoading, isError, error } = useQuery<ProjectionItem[]>({
    queryKey: ['simulationProjection', simulation.id],
    queryFn: async () => {
      // A rota getProjection do backend retorna um array de ProjectionItem
      const response = await api.get(`/simulations/${simulation.id}/projection?months=360`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-gray-500">Carregando dados de projeção...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-red-500">
            Erro ao carregar projeção: {error?.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!projectionData || projectionData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-center text-gray-500">
            Nenhum dado de projeção disponível para esta simulação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <ProjectionChart data={projectionData} simulationName={simulation.name} />;
}
