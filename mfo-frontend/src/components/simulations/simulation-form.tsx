// src/components/simulations/simulation-form.tsx
'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateSimulationForm,
  CreateSimulationFormSchema,
  LifeStatusEnum,
  SimulationResponse,
} from '@/lib/schemas/simulation.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Se precisar de descrição

interface SimulationFormProps {
  initialData?: SimulationResponse;
  onSubmit: (data: CreateSimulationForm) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SimulationForm({ initialData, onSubmit, onCancel, isSubmitting }: SimulationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateSimulationForm>({
    resolver: zodResolver(CreateSimulationFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          startDate: initialData.startDate.split('T')[0], // Formata para YYYY-MM-DD
          realRate: initialData.realRate,
          inflation: initialData.inflation,
          lifeStatus: initialData.lifeStatus,
        }
      : {
          name: '',
          startDate: new Date().toISOString().split('T')[0], // Data atual como padrão
          realRate: 0.03, // Exemplo de padrão
          inflation: 0.02, // Exemplo de padrão
          lifeStatus: 'NORMAL',
        },
  });

  // Para o Select, precisamos usar setValue e watch
  const lifeStatus = watch('lifeStatus');

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        startDate: initialData.startDate.split('T')[0],
        realRate: initialData.realRate,
        inflation: initialData.inflation,
        lifeStatus: initialData.lifeStatus,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: CreateSimulationForm) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Simulação</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="startDate">Data de Início</Label>
        <Input id="startDate" type="date" {...register('startDate')} />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
      </div>

      <div>
        <Label htmlFor="realRate">Taxa Real de Retorno Anual (ex: 0.03 para 3%)</Label>
        <Input id="realRate" type="number" step="0.001" {...register('realRate', { valueAsNumber: true })} />
        {errors.realRate && <p className="text-red-500 text-sm">{errors.realRate.message}</p>}
      </div>

      <div>
        <Label htmlFor="inflation">Taxa de Inflação Anual (ex: 0.02 para 2%)</Label>
        <Input id="inflation" type="number" step="0.001" {...register('inflation', { valueAsNumber: true })} />
        {errors.inflation && <p className="text-red-500 text-sm">{errors.inflation.message}</p>}
      </div>

      <div>
        <Label htmlFor="lifeStatus">Status de Vida</Label>
        <Select onValueChange={(value: LifeStatusEnum) => setValue('lifeStatus', value)} value={lifeStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status de vida" />
          </SelectTrigger>
          <SelectContent>
            {LifeStatusEnum.options.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'NORMAL' ? 'Normal' : status === 'RETIRED' ? 'Aposentado' : 'Falecido'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lifeStatus && <p className="text-red-500 text-sm">{errors.lifeStatus.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Simulação'}
        </Button>
      </div>
    </form>
  );
}
