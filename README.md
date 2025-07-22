# GIFUSION AI - Face Swap Frontend

Uma interface moderna e limpa para face swap, construída com React, TypeScript e Tailwind CSS.

## 🚀 Características

- ✨ Interface moderna e responsiva
- 🎨 Tema escuro/claro
- 📱 Design mobile-first
- 🖼️ Upload de imagens com drag & drop
- 🔍 Busca de GIFs via Tenor API
- 🎯 Pronto para integração com APIs

## 🛠️ Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎯 Uso

1. **Upload de Imagem**: Arraste ou clique para selecionar sua foto
2. **Seleção de Alvo**: Faça upload de uma imagem ou busque GIFs no Tenor
3. **Processamento**: Clique em "Demo Face Swap" para visualizar
4. **Download**: Baixe o resultado (modo demo mostra a imagem alvo)

## 🔌 Integração com API

Para conectar com uma API de face swap real, edite o arquivo `src/App.tsx` na função `processImages()`:

```typescript
const processImages = async () => {
  // Substituir por chamada real da API
  const result = await faceSwapAPI.process(userImage, selectedGif);
  setResult(result);
};
```

## 🎨 Personalização

- **Cores**: Edite as classes Tailwind nos componentes
- **Layout**: Modifique a estrutura em `src/App.tsx`
- **Estilos**: Ajuste o CSS global em `src/index.css`

## 📁 Estrutura

```
src/
├── components/
│   ├── ImageUploader.tsx     # Upload de imagens
│   ├── GifSelector.tsx       # Seleção de GIFs
│   ├── ProcessingStatus.tsx  # Status de processamento
│   └── ResultDisplay.tsx     # Exibição de resultados
├── utils/
│   ├── FaceSwapAPI.ts        # Cliente API (removido)
│   └── ReplicateAPI.ts       # Cliente Replicate (removido)
├── App.tsx                   # Componente principal
├── main.tsx                  # Entry point
└── index.css                 # Estilos globais
```

## 🌟 Recursos

- **Drag & Drop**: Interface intuitiva para upload
- **Busca de GIFs**: Integração com Tenor API
- **Responsive**: Funciona em desktop e mobile
- **Acessível**: Seguindo boas práticas de UX
- **Performante**: Otimizado com Vite e React

## 🚀 Deploy

```bash
# Build do projeto
npm run build

# A pasta dist/ contém os arquivos para deploy
```

Compatible com Netlify, Vercel, GitHub Pages e qualquer hospedagem estática.

## 📄 Licença

MIT License - Use como quiser!