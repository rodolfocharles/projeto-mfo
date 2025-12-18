# MFO Backend - API RESTful

Este é o repositório do backend do projeto Gerenciador Financeiro Otimizado (MFO). Ele é construído com **Fastify**, **Prisma ORM** e **TypeScript**, fornecendo uma API RESTful robusta e performática para gerenciar clientes, alocações, simulações e projeções financeiras.

## 📋 Sumário

1.  [Tecnologias Utilizadas](#1-tecnologias-utilizadas)
2.  [Arquitetura Geral](#2-arquitetura-geral)
3.  [Decisões Importantes de Design e Implementação](#3-decisões-importantes-de-design-e-implementação)
4.  [Configuração do Ambiente e Execução](#4-configuração-do-ambiente-e-execução)
    *   [Pré-requisitos](#pré-requisitos)
    *   [Variáveis de Ambiente](#variáveis-de-ambiente)
    *   [Instalação de Dependências](#instalação-de-dependências)
    *   [Migrações do Banco de Dados](#migrações-do-banco-de-dados)
    *   [Como Rodar o Backend (Desenvolvimento)](#como-rodar-o-backend-desenvolvimento)
    *   [Como Rodar o Backend (Produção)](#como-rodar-o-backend-produção)
5.  [Testes Automatizados](#5-testes-automatizados)
6.  **[Dockerfile](#6-dockerfile)**  <-- **Atualizado**
7.  [Estrutura de Rotas da API](#7-estrutura-de-rotas-da-api)

---

## 1. Tecnologias Utilizadas

*   **Framework Web:** [Fastify](https://www.fastify.io/) - Framework web de alta performance focado em velocidade e baixo overhead.
*   **ORM (Object-Relational Mapper):** [Prisma](https://www.prisma.io/) - ORM moderno com tipagem segura para interagir com o banco de dados.
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript para maior segurança e manutenibilidade do código.
*   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) - Sistema de gerenciamento de banco de dados relacional robusto e de código aberto.
*   **Validação de Dados:** [Zod](https://zod.dev/) - Biblioteca de validação de schema em tempo de execução e inferência de tipos.
*   **Autenticação:** [JWT (JSON Web Tokens)](https://jwt.io/) - Padrão para criação de tokens de acesso seguros.
*   **Testes:** [Vitest](https://vitest.dev/) (ou Jest, dependendo da sua escolha) - Framework de testes rápido e configurável.
*   **Containerização:** [Docker](https://www.docker.com/) - Para empacotar a aplicação e suas dependências em contêineres.

---

## 2. Arquitetura Geral

O backend segue uma arquitetura modular e em camadas, promovendo a separação de responsabilidades e facilitando a manutenção e escalabilidade.

*   **`src/app.ts`**:
    *   Ponto de entrada principal da aplicação Fastify.
    *   Responsável pela configuração do servidor, registro de plugins (CORS, JWT, etc.) e montagem das rotas da API.
    *   Orquestra a inicialização do Prisma Client e o disponibiliza para os controllers.

*   **`src/controllers/`**:
    *   Contém a lógica de negócio principal para cada recurso (e.g., `client.controller.ts`, `simulation.controller.ts`, `insurance.controller.ts`).
    *   Cada controller é uma classe que encapsula os métodos para lidar com as requisições HTTP (CRUD - Create, Read, Update, Delete).
    *   Interage diretamente com o Prisma Client para realizar operações de banco de dados.
    *   Valida os dados de entrada usando os schemas Zod antes de processar a lógica.

*   **`src/schemas/`**:
    *   Define os schemas de validação de entrada (request body/query/params) e saída (response) usando a biblioteca Zod.
    *   Garante a integridade e o formato correto dos dados que trafegam pela API.
    *   Permite inferir tipos TypeScript diretamente dos schemas, mantendo a tipagem segura em toda a aplicação.
    *   Inclui schemas para entidades como `Client`, `Simulation`, `Allocation`, `Insurance`, e schemas utilitários (`common.schema.ts`).

*   **`src/plugins/`**:
    *   Contém plugins Fastify para funcionalidades transversais, como:
        *   **Autenticação JWT:** Middleware para proteger rotas e verificar tokens de acesso.
        *   **CORS (Cross-Origin Resource Sharing):** Configuração para permitir requisições de domínios diferentes (essencial para o frontend).

*   **`src/lib/`**:
    *   Utilitários e funções auxiliares que podem ser compartilhadas entre diferentes partes do backend.
    *   Exemplos: funções de hash de senha, formatadores de data, etc.

*   **`prisma/`**:
    *   Contém o `schema.prisma`, que define o modelo de dados da aplicação e o relacionamento entre as entidades.
    *   Gerencia as migrações do banco de dados, permitindo evoluir o schema de forma controlada.

---

## 3. Decisões Importantes de Design e Implementação

*   **Fastify para Performance:** A escolha do Fastify foi motivada pela necessidade de uma API de alta performance e baixo overhead. Sua arquitetura de plugins e validação de schema integrada (via `fastify-zod` ou manual) otimiza o processamento de requisições.
*   **Prisma ORM para Produtividade e Segurança:** O Prisma oferece uma experiência de desenvolvimento superior com tipagem forte, autocompletar e um sistema de migrações robusto. Isso reduz erros em tempo de execução e acelera o desenvolvimento de funcionalidades de banco de dados.
*   **TypeScript para Manutenibilidade:** A utilização de TypeScript em todo o projeto garante a detecção precoce de erros, melhora a legibilidade do código e facilita a colaboração em equipes, especialmente em projetos de médio a grande porte.
*   **Zod para Validação Unificada:** Zod é usado para validar todos os dados de entrada e saída da API. Sua capacidade de inferir tipos TypeScript diretamente dos schemas Zod garante que a API e o código estejam sempre sincronizados em termos de estrutura de dados.
*   **Lógica de Projeção Financeira:**
    *   A função `calculateProjection` no `simulation.controller.ts` é o coração da funcionalidade de projeção. Ela simula a evolução do patrimônio ao longo do tempo, considerando:
        *   **Taxa Real de Juros:** Ajustada pela inflação para refletir o ganho real.
        *   **Movimentos Financeiros:** Entradas e saídas de dinheiro do cliente.
        *   **Snapshots de Alocação:** O balanço inicial é derivado do último snapshot de alocações do cliente.
    *   Esta função é projetada para ser flexível, permitindo a futura adição de diferentes cenários (e.g., impacto de seguros, eventos de vida).
*   **Comparação de Simulações:** A rota `/simulations/compare` utiliza a `calculateProjection` para duas simulações distintas e compara seus resultados mês a mês, fornecendo uma análise detalhada das diferenças entre cenários.
*   **Autenticação JWT:** Implementada para proteger as rotas da-lo isoladamente (assumindo que o banco de dados esteja disponível) ou como parte do projeto completo via Docker Compose (recomendado para desenvolvimento).

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine e Docker Compose)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `mfo-backend` com as seguintes variáveis:

### Swagger

Link para acesso ao swagger http://localhost:3333/docs#/:

