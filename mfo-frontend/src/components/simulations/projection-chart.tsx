// src/components/simulations/projection-chart.tsx
'use client'

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ProjectionItem } from '@/lib/schemas/simulation.schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectionChartProps {
  data: ProjectionItem[];
  simulationName: string;
}

// Formatar valores monetários para o tooltip
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
  return date.toLocaleDateString('pt-BR', { year: '2-digit', month: 'short' });
};

// Preparar dados para os gráficos (reduzir para cada 12 meses para melhor visualização)
const prepareChartData = (data: ProjectionItem[]) => {
  return data.filter((item, index) => index % 12 === 0).map((item) => ({
    ...item,
    period: formatDate(item.period),
  }));
};

export function ProjectionChart({ data, simulationName }: ProjectionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Projeção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nenhum dado de projeção disponível.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = prepareChartData(data);

  return (
    <div className="space-y-6">
      {/* Gráfico de Linha: Evolução do Patrimônio Total */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Patrimônio Total - {simulationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                dot={false}
                name="Patrimônio Total"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Barras: Receitas vs Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas - {simulationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Receitas"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                name="Despesas"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estatísticas Resumidas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Projeção - {simulationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patrimônio Inicial */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Patrimônio Inicial</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(chartData[0]?.balance || 0)}
              </p>
            </div>

            {/* Patrimônio Final */}
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Patrimônio Final</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(chartData[chartData.length - 1]?.balance || 0)}
              </p>
            </div>

            {/* Crescimento */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Crescimento Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(
                  (chartData[chartData.length - 1]?.balance || 0) - (chartData[0]?.balance || 0)
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(
                  (((chartData[chartData.length - 1]?.balance || 0) - (chartData[0]?.balance || 0)) /
                    (chartData[0]?.balance || 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Detalhada de Projeção */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Projeção (Anual) - {simulationName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-3">Período</th>
                  <th className="text-right p-3">Receitas</th>
                  <th className="text-right p-3">Despesas</th>
                  <th className="text-right p-3">Fluxo Líquido</th>
                  <th className="text-right p-3">Patrimônio</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.period}</td>
                    <td className="text-right p-3 text-green-600 font-medium">
                      {formatCurrency(item.income)}
                    </td>
                    <td className="text-right p-3 text-red-600 font-medium">
                      {formatCurrency(item.expense)}
                    </td>
                    <td className="text-right p-3 font-medium">
                      {formatCurrency(item.income - item.expense)}
                    </td>
                    <td className="text-right p-3 font-bold text-blue-600">
                      {formatCurrency(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
