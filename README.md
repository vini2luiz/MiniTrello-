
# Sistema de Gerenciamento de Tarefas

Um sistema web de gerenciamento de tarefas (similar ao Trello) desenvolvido com React, TypeScript e simulação de backend com localStorage.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Autenticação:** JWT (simulado)
- **Persistência:** localStorage (simulando SQLite)
- **Ícones:** Lucide React

## 📋 Funcionalidades

### Autenticação:
- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ Logout
- ✅ Proteção de rotas

### Gerenciamento de Tarefas
- ✅ **CREATE:** Criar novas tarefas
- ✅ **READ:** Listar todas as tarefas do usuário
- ✅ **UPDATE:** Atualizar status e dados das tarefas
- ✅ **DELETE:** Remover tarefas

### Interface
- 📊 Dashboard com estatísticas
- 📋 Board estilo Kanban (Pendente, Em Progresso, Concluído)
- 🎨 Interface responsiva e moderna
- 🔄 Drag & drop entre colunas de status

## 🛠️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## 📦 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd sistema-gerenciamento-tarefas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

### 4. Acesse a aplicação
Abra seu navegador e acesse: `http://localhost:8080`

## 🔧 Scripts Disponíveis

```bash
# Executa o projeto em modo de desenvolvimento
npm run dev

# Gera o build de produção
npm run build

# Visualiza o build de produção
npm run preview

# Executa o linter
npm run lint
```

## 📖 Como Usar

### 1. Primeiro Acesso
1. Acesse a aplicação
2. Clique na aba "Cadastrar"
3. Crie sua conta com usuário e senha
4. Faça login automaticamente

### 2. Gerenciando Tarefas
1. Clique em "Nova Tarefa" para criar uma tarefa
2. Preencha título, descrição e status inicial
3. Use os cartões para:
   - ✏️ Editar tarefa (ícone de lápis)
   - 🗑️ Excluir tarefa (ícone de lixeira)
   - 🔄 Alterar status (dropdown no cartão)

### 3. Organizando o Board
- **Pendente:** Tarefas criadas e aguardando início
- **Em Progresso:** Tarefas sendo executadas
- **Concluído:** Tarefas finalizadas

## 🗃️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── AuthForm.tsx    # Formulário de autenticação
│   ├── TaskBoard.tsx   # Board principal de tarefas
│   ├── TaskCard.tsx    # Cartão individual da tarefa
│   └── TaskForm.tsx    # Formulário de tarefa
├── contexts/           # Context APIs
│   └── AuthContext.tsx # Contexto de autenticação
├── hooks/              # Custom hooks
│   └── use-toast.ts    # Hook de notificações
├── pages/              # Páginas da aplicação
│   └── Index.tsx       # Página principal
├── services/           # Serviços e APIs
│   └── api.ts          # API simulada
├── types/              # Definições TypeScript
│   └── index.ts        # Types principais
└── lib/                # Utilitários
    └── utils.ts        # Funções auxiliares
```

## 🔌 API Simulada

O projeto simula uma API REST completa usando localStorage:

### Endpoints de Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login de usuário

### Endpoints de Tarefas (Protegidos)
- `GET /tasks` - Listar tarefas do usuário
- `POST /tasks` - Criar nova tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa

### Headers Necessários
```
Authorization: Bearer <jwt_token>
```

## 📊 Dados Persistidos

Os dados são salvos no localStorage do navegador:
- `taskmanager_auth` - Dados de autenticação
- `taskmanager_users` - Lista de usuários
- `taskmanager_tasks` - Lista de tarefas

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Estrutura de Deploy
Após o build, os arquivos estarão na pasta `dist/` prontos para deploy em qualquer servidor web estático.

### Opções de Hospedagem
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🛡️ Segurança

⚠️ **Importante:** Este é um projeto acadêmico com simulação de backend. Em produção, implemente:

- Hash de senhas (bcrypt)
- Validação JWT no servidor
- HTTPS obrigatório
- Sanitização de dados
- Rate limiting
- Validação de entrada

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme se está usando Node.js 18+
3. Limpe o cache: `npm clean-install`
4. Reinicie o servidor de desenvolvimento

---

**Desenvolvido para fins acadêmicos** 🎓
