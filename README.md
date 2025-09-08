# Sistema Localiza MT - Pessoas Desaparecidas

Sistema desenvolvido para o processo seletivo da empresa desenvolve MT. É um site com informações de pessoas desaparecidas em Mato Grosso que utiliza a API da Polícia Judiciária Civil (PJC-MT). 

## Dados de Inscrição
Nome Completo: Carlos Rafael Nogueira de Arruda Silva.
Vaga Selecionada: Pleno.

## Tecnologias Utilizadas

### Frontend
- **Next.js 15.5.2** - Framework React com App Router
- **React 19.1.0** - Biblioteca de interface de usuário
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Redux Toolkit 2.9.0** - Gerenciamento de estado
- **Axios** - Cliente HTTP para APIs

### Desenvolvimento
- **ESLint** - Linting de código
- **Turbopack** - Bundler rápido do Next.js
- **Docker** - Containerização

### Infraestrutura
- **Docker Compose** - Orquestração de containers
- **Alpine Linux** - Imagem base otimizada
- **Health Checks** - Monitoramento de saúde da aplicação

## Executando com Docker

### Pré-requisitos

- **Docker** instalado e rodando
- **Docker Compose** (recomendado)
- **Porta 3000** disponível

### Opção 1: Docker Compose (Recomendado)

```bash
# Build e execução em um comando
docker-compose up --build

# Execução em background
docker-compose up -d --build
```

### Opção 2: Docker Direto

```bash
# Build da imagem
docker build -t localiza-mt-app .

# Executar container
docker run -p 3000:3000 localiza-mt-app
```


## Solução para Problemas de Build

Se encontrar erro "Cannot find module 'critters'" ou problemas similares:

### Solução 1: Dockerfile Alternativo

```bash
# Usar o Dockerfile alternativo
docker build -f Dockerfile.alternative -t localiza-mt-app .

# Ou com compose alternativo
docker-compose -f docker-compose.alternative.yml up --build
```

### Solução 2: Limpar Cache

```bash
# Limpar cache do Docker
docker system prune -a -f

# Rebuild sem cache
docker build --no-cache -t localiza-mt-app .
```

### Solução 3: Build Local Primeiro

```bash
# Build local da aplicação
npm run build

# Depois build do Docker
docker build -t localiza-mt-app .
```

## Acessando a Aplicação

Após executar o Docker:

- **Aplicação**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health


## Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── api/               # API Routes
│   ├── como-ajudar/       # Página "Como Ajudar"
│   ├── pessoa/[id]/       # Página de detalhes da pessoa
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   └── providers.tsx      # Providers (Redux, etc.)
├── components/             # Componentes React reutilizáveis
│   ├── lazy/              # Componentes com lazy loading
│   ├── CarrosselAcoes.tsx # Carrossel de ações
│   ├── PersonCard.tsx     # Card de pessoa desaparecida
│   ├── SearchBar.tsx      # Barra de pesquisa
│   ├── Pagination.tsx     # Componente de paginação
│   └── ...
├── hooks/                  # Hooks customizados
│   ├── useDesaparecidos.ts # Hook para dados de desaparecidos
│   ├── useEstatisticas.ts # Hook para estatísticas
│   └── useNavigation.ts   # Hook para navegação
├── services/               # Serviços de API
│   └── desaparecidosService.ts # Serviço principal da API
├── store/                  # Redux store
│   ├── slices/            # Redux slices
│   ├── hooks.ts           # Hooks do Redux
│   └── index.ts           # Configuração do store
├── types/                  # Definições TypeScript
│   └── api.ts             # Tipos da API
├── lib/                    # Configurações e utilitários
│   ├── axios.ts           # Configuração do Axios
│   └── mockAdapter.ts     # Mock da API para desenvolvimento
└── config/                 # Configurações da aplicação
    └── config.ts           # Configurações gerais
```

## Funcionalidades Principais

### Busca e Filtros
- **Busca por nome** - Pesquisa por nome da pessoa
- **Filtros avançados** - Por sexo, idade, data de desaparecimento
- **Paginação inteligente** - Navegação eficiente entre resultados
- **Reset de filtros** - Limpeza rápida dos filtros aplicados

### Estatísticas em Tempo Real
- **Total de pessoas** - Contador geral de registros
- **Pessoas desaparecidas** - Quantidade atual
- **Pessoas localizadas** - Casos resolvidos
- **Barras de progresso** - Visualização percentual

### Visualização de Dados
- **Cards responsivos** - Layout adaptável para todos os dispositivos
- **Lazy loading** - Carregamento otimizado conforme scroll
- **Página de detalhes** - Informações completas da pessoa
- **Galeria de fotos** - Visualização de imagens disponíveis
- **Status visual** - Indicadores de localizado/desaparecido

### Sistema de Informações
- **Formulário de contato** - Envio de informações sobre desaparecidos
- **Modal de informações** - Visualização de dados adicionais
- **Sistema de anexos** - Upload de arquivos relacionados
- **Validação de dados** - Verificação de campos obrigatórios

## API e Integração

### API da PJC-MT
A aplicação consome a API oficial da Polícia Judiciária Civil de Mato Grosso:

- **Base URL**: `https://abitus-api.geia.vip/v1`
- **Endpoints principais**:
  - `/pessoas-desaparecidas` - Lista de pessoas desaparecidas
  - `/estatisticas` - Estatísticas gerais
  - `/informacoes-desaparecido` - Informações detalhadas
  - `/enviar-informacao` - Envio de informações

### Mock para Desenvolvimento
- **Mock Adapter** - Simulação da API para desenvolvimento local
- **Dados de teste** - Conjunto de dados realistas para testes
- **Configuração flexível** - Fácil alternância entre mock e API real

### Configurações
- **Timeout configurável** - Controle de tempo limite das requisições
- **Retry automático** - Tentativas automáticas em caso de falha
- **Interceptors** - Interceptação e tratamento de requisições/respostas
