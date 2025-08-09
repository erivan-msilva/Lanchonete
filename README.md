# Controle de Lanchonete - Tecnologias Utilizadas

Este aplicativo de controle de lanchonete foi desenvolvido utilizando diversas tecnologias modernas para desenvolvimento de aplicativos móveis. Abaixo está a lista detalhada de todas as tecnologias e bibliotecas implementadas:

## Tecnologias Principais

1. **React Native**
   - Framework JavaScript para desenvolvimento de aplicativos móveis multiplataforma
   - Permite criar aplicativos nativos para iOS e Android a partir de uma única base de código

2. **Expo**
   - Plataforma e conjunto de ferramentas construídas em torno do React Native
   - Facilita o desenvolvimento, teste e implantação de aplicativos React Native
   - Fornece acesso a APIs nativas sem necessidade de configuração complexa

## Bibliotecas e Dependências

1. **@react-native-async-storage/async-storage**
   - Sistema de armazenamento local persistente para React Native
   - Utilizado para salvar o histórico de compras do usuário no dispositivo
   - Garante que os dados permaneçam após o fechamento do aplicativo

2. **@react-native-picker/picker**
   - Componente de seleção (dropdown) nativo para React Native
   - Implementado para a seleção de formas de pagamento (Dinheiro, PIX, Cartão)

3. **@expo/vector-icons**
   - Biblioteca de ícones vetoriais para aplicativos Expo
   - Inclui coleções populares como:
     - Ionicons
     - MaterialCommunityIcons
     - FontAwesome5
   - Utilizada para melhorar a interface do usuário com ícones visuais

## Componentes React Native

1. **Componentes de Interface**
   - `View`: Contêineres básicos para layout
   - `Text`: Exibição de texto
   - `TextInput`: Campos de entrada de texto
   - `ScrollView`: Visualização com rolagem
   - `FlatList`: Lista eficiente para grandes conjuntos de dados
   - `TouchableOpacity`: Áreas tocáveis com feedback visual
   - `SafeAreaView`: Área segura para dispositivos com entalhes ou cantos arredondados
   - `KeyboardAvoidingView`: Evita que o teclado sobreponha os elementos de entrada

2. **Componentes Utilitários**
   - `Alert`: Sistema de alertas nativos
   - `StatusBar`: Controle da barra de status do dispositivo
   - `Platform`: Detecção da plataforma (iOS/Android)

## Tecnologias de Estilização

1. **StyleSheet**
   - API do React Native para criar estilos de componentes
   - Fornece otimização de desempenho para estilos
   - Permite a criação de uma interface consistente

## Armazenamento de Dados

1. **AsyncStorage**
   - Sistema de armazenamento de chave-valor assíncrono
   - Persiste dados do aplicativo localmente no dispositivo
   - Implementado para salvar histórico de compras

## Gerenciamento de Estado

1. **React Hooks**
   - `useState`: Gerenciamento de estado local dos componentes
   - `useEffect`: Execução de efeitos colaterais (como carregar/salvar dados)

## Estrutura do Projeto

1. **Expo Managed Workflow**
   - Configuração do projeto gerenciada pelo Expo
   - Configurações definidas no arquivo `app.json`
   - Automatiza o processo de build e publicação

2. **Assets**
   - Gerenciamento de recursos como imagens e ícones
   - Logo personalizado para o aplicativo

## Funcionalidades Implementadas

1. **Gestão de Itens**
   - Adição de itens personalizados
   - Catálogo de itens pré-definidos com ícones
   - Remoção de itens da lista

2. **Cálculos Financeiros**
   - Cálculo automático de subtotais
   - Soma total da compra

3. **Formas de Pagamento**
   - Seleção entre diferentes métodos (Dinheiro, PIX, Cartões)

4. **Histórico de Compras**
   - Armazenamento persistente
   - Visualização organizada por data
   - Detalhes completos de cada compra

5. **Interface Responsiva**
   - Adaptação a diferentes tamanhos de tela
   - Suporte a orientações retrato
   - Compatibilidade com iOS e Android

## Ferramentas de Desenvolvimento

1. **npm/Node.js**
   - Gerenciamento de pacotes e dependências
   - Execução de scripts de desenvolvimento

2. **Expo CLI**
   - Interface de linha de comando para gerenciar projetos Expo
   - Comandos para iniciar, testar e publicar o aplicativo

Este aplicativo representa uma solução completa para gerenciamento de vendas em lanchonetes, combinando tecnologias modernas de desenvolvimento mobile com uma interface amigável e funcionalidades práticas para o dia a dia.
