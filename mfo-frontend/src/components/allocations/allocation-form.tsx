// src/components/allocations/allocation-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateAllocationFormSchema, AllocationResponse } from '@/lib/schemas/allocation.schema'
import { useEffect } from 'react'

interface AllocationFormProps {
  initialData?: AllocationResponse
  onSubmit: (data: z.infer<typeof CreateAllocationFormSchema>) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function AllocationForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: AllocationFormProps) {
  const form = useForm<z.infer<typeof CreateAllocationFormSchema>>({
    resolver: zodResolver(CreateAllocationFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: (initialData?.type === 'FINANCIAL' || initialData?.type === 'IMMOBILIZED')
              ? initialData.type
              : 'FINANCIAL',
      value: initialData?.value !== undefined && initialData?.value !== null
              ? initialData.value
              : 0,
      date: initialData?.startDate
              ? new Date(initialData.startDate).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
    },
  })

  const { formState: { errors, isValid, isDirty } } = form;
  useEffect(() => {
    console.log('AllocationForm - initialData:', initialData);
    console.log('AllocationForm - formState.errors:', errors);
    console.log('AllocationForm - formState.isValid:', isValid);
    console.log('AllocationForm - formState.isDirty:', isDirty);
    console.log('AllocationForm - isSubmitting prop:', isSubmitting);
  }, [initialData, errors, isValid, isDirty, isSubmitting]);


  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: (initialData.type === 'FINANCIAL' || initialData.type === 'IMMOBILIZED')
                ? initialData.type
                : 'FINANCIAL',
        value: initialData.value !== undefined && initialData.value !== null
                ? initialData.value
                : 0,
        date: new Date(initialData.startDate).toISOString().split('T')[0],
      })
    }
  }, [initialData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da alocação" {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}> {/* Use 'value' aqui para Select */}
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FINANCIAL">Financeira</SelectItem>
                  <SelectItem value="IMMOBILIZED">Imobilizada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
