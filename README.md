# Kairos Broker Frontend (Simulador de Corretora)

## Visão Geral

O Kairos Broker é uma Single Page Application (SPA) desenvolvida em Vue 3 + TypeScript, projetada para simular o painel de controle e as funcionalidades essenciais de uma corretora de valores. O projeto foca em uma arquitetura limpa e desacoplada, utilizando serviços mockados com persistência local (`localStorage`) para simular um ambiente de Back-end real.

## Destaques & Funcionalidades

- **Autenticação Funcional:** Fluxo completo de Login, Registro e Redefinição de Senha (via Modais), com validação de campos dinâmicos.
- **Simulação de Trade:** Execução de ordens de Compra e Venda que realizam:
  - Atualização imediata do Saldo e Posições (Preço Médio, Quantidade).
  - Registro das transações no extrato bancário e histórico de ordens.
- **Portfólio Dinâmico:** Visualização da rentabilidade total e cards de ativos, começando com um saldo inicial fixo (R$ 10.000,00).
- **Busca Real:** Listagem e busca de ativos com _debounce_ e otimização de API (`stockService`).
- **Acessibilidade (ARIA):** Componentes críticos (Modais, Formulários, Navegação) configurados com atributos ARIA para melhor compatibilidade com leitores de tela.

## Tecnologias Principais

O projeto utiliza o seguinte stack:

| Categoria          | Pacotes                         |
| :----------------- | :------------------------------ |
| **Core Framework** | `vue`, `vue-router`, `pinia`    |
| **UI/Design**      | `vuetify`                       |
| **Gráficos**       | `apexcharts`, `vue3-apexcharts` |
| **Network**        | `axios`                         |

## Configuração e Instalação

### Pré-requisitos

- Node.js (LTS recomendado)
- npm ou Yarn

### Passos de Execução

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Configuração da API (Backend):**

    Crie um arquivo `.env` na raiz do projeto. Para funcionar localmente e evitar o bloqueio de CORS, é **obrigatório** usar a configuração de Proxy do Vite (assumindo que você configurou `proxy: {'/api': {...}}` no `vite.config.ts`).

    **Exemplo de `.env`:**

    ```properties
    VITE_API_URL=/api
    ```

3.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

O aplicativo estará disponível em `http://localhost:5173`. Todos os dados de usuário e portfólio serão salvos automaticamente no `localStorage` do seu navegador.
