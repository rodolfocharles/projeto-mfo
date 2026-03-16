# MFO Backend - API RESTful

Este é o repositório do backend do projeto **Gerenciador Financeiro Otimizado (MFO)**.
Construído com **Fastify**, **Prisma ORM** e **TypeScript**, fornece uma API REST modular
para gerenciar clientes, alocações, movimentos, seguros, simulações e projeções.

## 📋 Sumário

1. [Tecnologias Utilizadas](#1-tecnologias-utilizadas)  
2. [Arquitetura e padrões de design](#2-arquitetura-e-padr%C3%B5es-de-design)  
3. [Configuração e execução](#3-configura%C3%A7%C3%A3o-e-execu%C3%A7%C3%A3o)  
    * Pré‑requisitos  
    * Variáveis de ambiente  
    * Instalação  
    * Migrações  
    * Desenvolvimento / Produção  
4. [Testes](#4-testes)  
5. [Dockerfile](#5-dockerfile)  
6. [Estrutura de rotas da API](#6-estrutura-de-rotas-da-api)  
7. [Notas rápidas](#7-notas-r%C3%A1pidas)

---

## 1. Tecnologias Utilizadas

* **Framework Web:** Fastify – alta performance, plugins e suporte a TypeScript.  
* **ORM:** Prisma – tipagem segura, migrações e cliente gerado.  
* **Linguagem:** TypeScript.  
* **Banco de Dados:** PostgreSQL.  
* **Validação:** Zod (schemas de entrada e saída).  
* **Autenticação:** JWT (JSON Web Tokens) – ainda não utilizada no código, mas
  referência futura.  
* **Testes:** Vitest/Jest (estrutura pronta, nenhum teste presente hoje).  
* **Containerização:** Docker (imagem fornecida pelo `Dockerfile`).

---

## 2. Arquitetura e padrões de design

O código adota princípios de **Domain‑Driven Design (DDD)** e **SOLID**:

* `src/domain` contém entidades, value‑objects, interfaces de repositório e serviços.  
* `src/application/use-cases` abriga os casos de uso – classes enfraquecidas pelo
  DIP (dependem de abstrações). Decoradores adicionam logs sem modificar lógica.  
* `src/infrastructure` contém implementações concretas: repositórios Prisma,
  serviços de hash, projeção e adaptação HTTP.  
* Controladores e rotas ficam em `infrastructure/http` ou na camada legada
  `src/routes`.  
* `src/app.ts` monta o grafo de dependências e configura o servidor Fastify.

Essa separação ajuda a cumprir SOLID:

* **SRP:** cada classe tem uma única responsabilidade (controller vs. serviço vs. repo).  
* **OCP:** os casos de uso podem ser estendidos via decoradores (ex. logging).  
* **LSP:** implementações substituem abstrações sem alterar comportamento.  
* **ISP:** interfaces são pequenas e específicas (por recurso).  
* **DIP:** módulos de alto nível dependem de interfaces, não concretos.

---

## 3. Configuração e execução

### Pré‑requisitos

* Node.js ≥ 18  
* npm  
* PostgreSQL  
* Docker/Docker‑Compose (opcional)

### Variáveis de ambiente

Crie `.env` na raiz com pelo menos:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/mfo_db
PORT=3333
```

Adicione variáveis extras (JWT_SECRET etc.) conforme o projeto evoluir.

### Instalação de dependências

```bash
npm install
```

### Migrações do banco

```bash
npm run db:migrate       # dev
npm run migrate:deploy   # produção
```

### Como rodar

**Desenvolvimento**

```bash
npm run dev
```

**Produção**

```bash
npm run build
npm start
```

---

## 4. Testes

Não existem testes automatizados atualmente. O projeto está pronto para
Vitest ou Jest; recomenda‑se a criação de suites nos diretórios relevantes.

---

## 5. Dockerfile

O `Dockerfile` usa build multi‑stage com Node 20, instala dependências, gera o
cliente Prisma e copia o código. A imagem final inclui `node_modules` e
expõe `3333`. O comando padrão é `npm start`.

---

## 6. Estrutura de rotas da API

* `/clients` – CRUD de clientes  
* `/allocations` – CRUD de alocações  
* `/movements` – CRUD de movimentos, listagens por cliente e por tipo  
* `/insurances` – CRUD de seguros  
* `/simulations` – CRUD de simulações, versões, projeções e comparação  
* `/history` – rota legada para histórico de processamento  
* `/allocation-snapshots` – rota legada de snapshots de alocação  

O Swagger está disponível em `/docs`.

---

## 7. Notas rápidas

* A camada “legacy” (`src/routes/*`) coexistiu com a nova estrutura DDD; a intenção
  é desativá‑la no futuro.  
* No momento não há autenticação: todas as rotas são públicas.  
* Lógica de projeção e comparação de simulações reside em `src/services` e nos
  casos de uso correspondentes.



### Swagger

Link para acesso ao swagger http://localhost:3333/docs#/:

