# MFO Frontend - Interface de Usuário

Este é o repositório do frontend do projeto Gerenciador Financeiro Otimizado (MFO). Ele é construído com **Next.js** e **React**, fornecendo uma interface de usuário intuitiva e responsiva para interagir com a API do backend.

## 📋 Sumário

1.  [Tecnologias Utilizadas](#1-tecnologias-utilizadas)
2.  [Estrutura de Pastas](#2-estrutura-de-pastas)
3.  [Principais Decisões de UX (Experiência do Usuário)](#3-principais-decisões-de-ux-experiência-do-usuário)
4.  [Configuração do Ambiente e Execução](#4-configuração-do-ambiente-e-execução)
    *   [Pré-requisitos](#pré-requisitos)
    *   [Variáveis de Ambiente](#variáveis-de-ambiente)
    *   [Instalação de Dependências](#instalação-de-dependências)
    *   [Como Rodar o Frontend (Desenvolvimento)](#como-rodar-o-frontend-desenvolvimento)
    *   [Como Rodar o Frontend (Produção)](#como-rodar-o-frontend-produção)
5.  **[Dockerfile](#5-dockerfile)**  <-- **Atualizado**

---

## 1. Tecnologias Utilizadas

*   **Framework Fullstack:** [Next.js](https://nextjs.org/) - Framework React para aplicações web de alto desempenho, com renderização no servidor (SSR) e geração de sites estáticos (SSG).
*   **Biblioteca UI:** [React](https://react.dev/) - Biblioteca JavaScript para construção de interfaces de usuário.
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first para construção rápida de designs personalizados.
*   **Componentes UI:** [Shadcn UI](https://ui.shadcn.com/) - Coleção de componentes UI reutilizáveis e acessíveis, construídos com Tailwind CSS e Radix UI.
*   **Gerenciamento de Estado/Dados:** [React Query (TanStack Query)](https://tanstack.com/query/latest) - Biblioteca poderosa para gerenciamento de dados assíncronos (fetching, caching, sincronização, atualização de dados do servidor).
*   **Validação de Formulários:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Solução eficiente para gerenciamento de formulários e validação de schema.
*   **Notificações:** [Sonner](https://sonner.emilkowal.ski/) - Componente de toast para notificações elegantes e acessíveis.
*   **Containerização:** [Docker](https://www.docker.com/) - Para empacotar a aplicação e suas dependências em contêineres.

---

## 2. Estrutura de Pastas

A estrutura de pastas do frontend segue as convenções do Next.js App Router, com uma organização lógica para facilitar a navegação e manutenção do código.

*   **`src/app/`**:
    *   Contém as rotas e páginas da aplicação Next.js.
    *   **`/(dashboard)/`**: Grupo de rotas para páginas protegidas que exigem autenticação. Inclui o layout principal da aplicação (sidebar, header) e páginas como `projection/page.tsx`, `allocations/page.tsx`, `insurances/page.tsx`.
    *   **`/(auth)/`**: Grupo de rotas para páginas de autenticação, como `login/page.tsx` e `register/page.tsx`.
    *   `layout.tsx`: Layouts globais ou específicos de grupos de rotas.
    *   `page.tsx`: Componentes de página.

*   **`src/components/`**:
    *   Contém componentes React reutilizáveis que podem ser usados em várias páginas ou layouts.
    *   **`ui/`**: Componentes Shadcn UI (botões, inputs, cards, diálogos, etc.).
    *   **`layout/`**: Componentes relacionados ao layout da aplicação (e.g., `sidebar.tsx`, `header.tsx`).
    *   **`auth/`**: Componentes relacionados à autenticação (e.g., `auth-provider.tsx`).
    *   **`charts/`**: Componentes para visualização de dados (e.g., gráficos de projeção).
    *   **`simulations/`**: Componentes específicos para a funcionalidade de simulações (e.g., `simulation-comparison.tsx`).

*   **`src/lib/`**:
    *   Contém funções utilitárias, configurações e bibliotecas de terceiros.
    *   **`api.ts`**: Instância configurada do Axios para fazer requisições HTTP ao backend.
    *   **`schemas/`**: Schemas Zod para validação de dados no frontend, muitas vezes espelhando os schemas do backend para garantir consistência.
    *   **`utils.ts`**: Funções utilitárias diversas (e.g., `cn` para classes Tailwind, formatadores de data).

*   **`src/hooks/`**:
    *   Contém custom hooks React para encapsular lógica reutilizável e estados complexos.
    *   Exemplos: `useAuth` para gerenciar o estado de autenticação.

*   **`src/styles/`**:
    *   Arquivos CSS globais e configurações do Tailwind CSS.

---

## 3. Principais Decisões de UX (Experiência do Usuário)

A interface do usuário foi projetada com foco em clareza, usabilidade e responsividade para proporcionar uma experiência agradável e eficiente ao usuário.

*   **Design Responsivo (Mobile-First):**
    *   A aplicação é construída com uma abordagem mobile-first, garantindo que ela se adapte e funcione bem em qualquer tamanho de tela, desde smartphones até monitores de desktop grandes.
    *   O Tailwind CSS é fundamental para essa flexibilidade, permitindo a criação de layouts fluidos e adaptáveis.

*   **Componentes Shadcn UI para Consistência e Acessibilidade:**
    *   A utilização de componentes Shadcn UI garante um design visual consistente em toda a aplicação.
    *   Esses componentes são construídos com acessibilidade em mente, seguindo as melhores práticas para garantir que a aplicação seja utilizável por todos.
    *   Eles proporcionam uma experiência de usuário moderna e profissional, com interações intuitivas (modals, selects, inputs).

*   **Fluxo de Projeção Financeira Claro e Visual:**
    *   A mais acessível e compreensível.

*   **Comparação de Simulações Lado a Lado:**
    *   A funcionalidade de comparação de simulações é implementada com um modal otimizado (`simulation-comparison.tsx`) que permite ao usuário visualizar e analisar as diferenças entre duas projeções financeiras simultaneamente.
    *   A tabela de comparação é responsiva, com scroll horizontal (`overflow-x-auto`), e o modal tem altura controlada (`max-h-[...]`) para garantir que todo o conteúdo seja acessível sem travar a navegação.

*   **Feedback Visual Instantâneo:**
    *   A biblioteca `sonner` é utilizada para exibir notificações (toasts) claras e não intrusivas, informando o usuário sobre o sucesso de suas ações (e.g., "Simulação criada com sucesso!") ou sobre possíveis erros.
    *   Estados de carregamento e erro são gerenciados com React Query, fornecendo feedback visual (spinners, mensagens de erro) durante operações assíncronas.

*   **Navegação Intuitiva:**
    *   Uma barra lateral (`sidebar.tsx`) fornece uma navegação clara e consistente entre as diferentes seções da aplicação (Dashboard, Alocações, Projeções, Seguros).
    *   Os ícones e nomes das seções são escolhidos para serem facilmente compreendidos.

---

## 4. Configuração do Ambiente e Execução

Para rodar o frontend, você pode optar por executá-lo isoladamente (assumindo que o backend esteja disponível) ou como parte do projeto completo via Docker Compose (recomendado para desenvolvimento).

### Pré-requisitos

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine e Docker Compose)

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz da pasta `mfo-frontend` com a seguinte variável:

