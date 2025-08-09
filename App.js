import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Lista de lanches pré-definidos
const LANCHES_PREDEFINIDOS = [
  { id: '1', nome: 'Hambúrguer Simples', preco: 15.90, icone: 'hamburger' },
  { id: '2', nome: 'Hambúrguer Duplo', preco: 22.90, icone: 'hamburger' },
  { id: '3', nome: 'Cachorro Quente', preco: 12.00, icone: 'hotdog' },
  { id: '4', nome: 'Batata Frita P', preco: 8.50, icone: 'french-fries' },
  { id: '5', nome: 'Batata Frita G', preco: 15.00, icone: 'french-fries' },
  { id: '6', nome: 'Açaí 300ml', preco: 14.00, icone: 'cup' },
  { id: '7', nome: 'Açaí 500ml', preco: 18.00, icone: 'cup' },
  { id: '8', nome: 'Refrigerante Lata', preco: 5.00, icone: 'soda-can' },
  { id: '9', nome: 'Milk Shake', preco: 12.00, icone: 'cup-straw' },
  { id: '10', nome: 'Pizza Fatia', preco: 10.00, icone: 'pizza-slice' },
];

export default function App() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [preco, setPreco] = useState('');
  const [listaItens, setListaItens] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [historicoCompras, setHistoricoCompras] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [mostrarLanchesPredefinidos, setMostrarLanchesPredefinidos] = useState(false);
  
  // Carregar histórico ao iniciar
  useEffect(() => {
    carregarHistorico();
  }, []);
  
  // Salvar histórico quando for alterado
  useEffect(() => {
    if (historicoCompras.length > 0) {
      salvarHistorico();
    }
  }, [historicoCompras]);
  
  const carregarHistorico = async () => {
    try {
      const historicoSalvo = await AsyncStorage.getItem('historicoCompras');
      if (historicoSalvo !== null) {
        setHistoricoCompras(JSON.parse(historicoSalvo));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    }
  };
  
  const salvarHistorico = async () => {
    try {
      await AsyncStorage.setItem('historicoCompras', JSON.stringify(historicoCompras));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o histórico.');
    }
  };
  
  const adicionarItem = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Digite o nome do item.');
      return;
    }
    
    if (isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida.');
      return;
    }
    
    if (isNaN(Number(preco)) || Number(preco) <= 0) {
      Alert.alert('Erro', 'Digite um preço válido.');
      return;
    }
    
    const qtd = Number(quantidade);
    const precoUnitario = Number(preco);
    const subtotal = qtd * precoUnitario;
    
    const novoItem = {
      id: Date.now().toString(),
      nome,
      quantidade: qtd,
      preco: precoUnitario,
      subtotal
    };
    
    setListaItens([...listaItens, novoItem]);
    limparCamposItem();
  };
  
  const limparCamposItem = () => {
    setNome('');
    setQuantidade('1');
    setPreco('');
  };

  const adicionarItemPredefinido = (item) => {
    const qtd = Number(quantidade);
    const subtotal = qtd * item.preco;
    
    const novoItem = {
      id: Date.now().toString(),
      nome: item.nome,
      quantidade: qtd,
      preco: item.preco,
      subtotal,
      icone: item.icone
    };
    
    setListaItens([...listaItens, novoItem]);
    setQuantidade('1');
    setMostrarLanchesPredefinidos(false);
  };
  
  const removerItem = (id) => {
    setListaItens(listaItens.filter(item => item.id !== id));
  };
  
  const calcularTotal = () => {
    return listaItens.reduce((total, item) => total + item.subtotal, 0);
  };
  
  const finalizarCompra = () => {
    if (listaItens.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um item à sua lista antes de finalizar.');
      return;
    }
    
    const formaPagamentoTexto = obterTextoPagamento(formaPagamento);
    const total = calcularTotal();
    const data = new Date();
    
    const compra = {
      id: Date.now().toString(),
      data: data.toLocaleString(),
      itens: [...listaItens],
      formaPagamento,
      formaPagamentoTexto,
      total
    };
    
    setHistoricoCompras([compra, ...historicoCompras]);
    setListaItens([]);
    
    Alert.alert(
      'Sucesso',
      `Compra finalizada!\nTotal: R$ ${total.toFixed(2)}\nForma de pagamento: ${formaPagamentoTexto}`
    );
  };
  
  const obterTextoPagamento = (valor) => {
    switch (valor) {
      case 'dinheiro': return 'Dinheiro';
      case 'pix': return 'PIX';
      case 'cartao_credito': return 'Cartão de Crédito';
      case 'cartao_debito': return 'Cartão de Débito';
      default: return valor;
    }
  };

  const getIconePagamento = (formaPagamento) => {
    switch (formaPagamento) {
      case 'dinheiro': return <MaterialCommunityIcons name="cash" size={18} color="#555" />;
      case 'pix': return <MaterialCommunityIcons name="qrcode" size={18} color="#555" />;
      case 'cartao_credito': return <FontAwesome5 name="credit-card" size={16} color="#555" />;
      case 'cartao_debito': return <FontAwesome5 name="credit-card" size={16} color="#555" />;
      default: return null;
    }
  };

  const renderIconeLanche = (icone, tamanho = 20, cor = "#333") => {
    switch (icone) {
      case 'hamburger': return <FontAwesome5 name="hamburger" size={tamanho} color={cor} />;
      case 'hotdog': return <FontAwesome5 name="hotdog" size={tamanho} color={cor} />;
      case 'french-fries': return <MaterialCommunityIcons name="french-fries" size={tamanho} color={cor} />;
      case 'cup': return <MaterialCommunityIcons name="cup" size={tamanho} color={cor} />;
      case 'soda-can': return <MaterialCommunityIcons name="soda-can" size={tamanho} color={cor} />;
      case 'cup-straw': return <MaterialCommunityIcons name="cup-water" size={tamanho} color={cor} />;
      case 'pizza-slice': return <FontAwesome5 name="pizza-slice" size={tamanho} color={cor} />;
      default: return <MaterialCommunityIcons name="food" size={tamanho} color={cor} />;
    }
  };
  
  const renderItemLista = ({ item }) => (
    <View style={styles.itemLista}>
      <View style={styles.itemInfo}>
        <View style={styles.itemNomeContainer}>
          {item.icone && renderIconeLanche(item.icone)}
          <Text style={styles.itemNome}>{item.nome}</Text>
        </View>
        <Text style={styles.itemDetalhes}>
          Qtd: {item.quantidade} x R$ {item.preco.toFixed(2)}
        </Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: R$ {item.subtotal.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.btnRemover}
        onPress={() => removerItem(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItemPredefinido = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemPredefinido}
      onPress={() => adicionarItemPredefinido(item)}
    >
      <View style={styles.itemIconeContainer}>
        {renderIconeLanche(item.icone, 24, "#4CAF50")}
      </View>
      <View style={styles.itemPredefinidoInfo}>
        <Text style={styles.itemPredefinidoNome}>{item.nome}</Text>
        <Text style={styles.itemPredefinidoPreco}>R$ {item.preco.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderItemHistorico = ({ item }) => (
    <View style={styles.historicoItem}>
      <Text style={styles.historicoData}>{item.data}</Text>
      <View style={styles.historicoPagamentoContainer}>
        {getIconePagamento(item.formaPagamento)}
        <Text style={styles.historicoPagamento}>
          {' '}Forma de pagamento: {item.formaPagamentoTexto}
        </Text>
      </View>
      <Text style={styles.historicoTotal}>
        <Ionicons name="wallet-outline" size={18} color="#4CAF50" /> Total: R$ {item.total.toFixed(2)}
      </Text>
      
      <View style={styles.historicoItensContainer}>
        <Text style={styles.historicoItensHeader}>Itens:</Text>
        {item.itens.map((subitem) => (
          <View key={subitem.id} style={styles.historicoSubitemContainer}>
            {subitem.icone && renderIconeLanche(subitem.icone, 16, "#555")}
            <Text style={styles.historicoSubitem}>
              {' '}{subitem.quantidade}x {subitem.nome} - R$ {subitem.subtotal.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="food-outline" size={32} color="#4CAF50" />
            <Text style={styles.titulo}>CGL- Controle de Gastos com Lanche</Text>
          </View>
          
          {!mostrarHistorico ? (
            <>
              <View style={styles.formContainer}>
                <View style={styles.subtituloContainer}>
                  <MaterialCommunityIcons name="plus-circle-outline" size={22} color="#444" />
                  <Text style={styles.subtitulo}>Adicionar Item</Text>
                </View>
                
                <View style={styles.inputRow}>
                  <TouchableOpacity
                    style={styles.btnLanchesPredefinidos}
                    onPress={() => setMostrarLanchesPredefinidos(!mostrarLanchesPredefinidos)}
                  >
                    <MaterialCommunityIcons name="food-variant" size={24} color="#fff" />
                    <Text style={styles.btnLanchesPredefinidosTexto}>
                      {mostrarLanchesPredefinidos ? 'Fechar Lista' : 'Ver Lanches'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {mostrarLanchesPredefinidos && (
                  <View style={styles.lanchesPredefinidosContainer}>
                    <FlatList
                      data={LANCHES_PREDEFINIDOS}
                      renderItem={renderItemPredefinido}
                      keyExtractor={item => item.id}
                      numColumns={2}
                      columnWrapperStyle={styles.lanchesPredefinidosRow}
                    />
                  </View>
                )}
                
                <Text style={styles.label}>
                  <Ionicons name="fast-food-outline" size={16} color="#555" /> Nome do Item
                </Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Ex: Hambúrguer"
                />
                
                <Text style={styles.label}>
                  <Ionicons name="calculator-outline" size={16} color="#555" /> Quantidade
                </Text>
                <TextInput
                  style={styles.input}
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                  placeholder="Ex: 2"
                />
                
                <Text style={styles.label}>
                  <Ionicons name="cash-outline" size={16} color="#555" /> Preço Unitário (R$)
                </Text>
                <TextInput
                  style={styles.input}
                  value={preco}
                  onChangeText={setPreco}
                  keyboardType="numeric"
                  placeholder="Ex: 15.90"
                />
                
                <TouchableOpacity
                  style={styles.btnAdicionar}
                  onPress={adicionarItem}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.btnAdicionarTexto}>Adicionar Item</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.listaContainer}>
                <View style={styles.subtituloContainer}>
                  <Ionicons name="list-outline" size={22} color="#444" />
                  <Text style={styles.subtitulo}>Lista de Itens</Text>
                </View>
                
                {listaItens.length > 0 ? (
                  <FlatList
                    data={listaItens}
                    renderItem={renderItemLista}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View style={styles.mensagemVaziaContainer}>
                    <MaterialCommunityIcons name="cart-outline" size={40} color="#ccc" />
                    <Text style={styles.mensagemVazia}>
                      Nenhum item adicionado. Adicione itens à sua lista.
                    </Text>
                  </View>
                )}
                
                {listaItens.length > 0 && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalTexto}>
                      <Ionicons name="wallet-outline" size={20} color="#000" /> Total: R$ {calcularTotal().toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.pagamentoContainer}>
                <View style={styles.subtituloContainer}>
                  <Ionicons name="card-outline" size={22} color="#444" />
                  <Text style={styles.subtitulo}>Finalizar Compra</Text>
                </View>
                
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="credit-card-outline" size={16} color="#555" /> Forma de Pagamento
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formaPagamento}
                    onValueChange={(itemValue) => setFormaPagamento(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Dinheiro" value="dinheiro" />
                    <Picker.Item label="PIX" value="pix" />
                    <Picker.Item label="Cartão de Crédito" value="cartao_credito" />
                    <Picker.Item label="Cartão de Débito" value="cartao_debito" />
                  </Picker>
                </View>
                
                <TouchableOpacity
                  style={styles.btnFinalizar}
                  onPress={finalizarCompra}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.btnFinalizarTexto}>Finalizar Compra</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.historicoContainer}>
              <View style={styles.subtituloContainer}>
                <Ionicons name="time-outline" size={22} color="#444" />
                <Text style={styles.subtitulo}>Histórico de Compras</Text>
              </View>
              
              {historicoCompras.length > 0 ? (
                <FlatList
                  data={historicoCompras}
                  renderItem={renderItemHistorico}
                  keyExtractor={item => item.id}
                />
              ) : (
                <View style={styles.mensagemVaziaContainer}>
                  <Ionicons name="receipt-outline" size={40} color="#ccc" />
                  <Text style={styles.mensagemVazia}>
                    Nenhuma compra registrada ainda.
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity
            style={[styles.btnAlternar, mostrarHistorico ? styles.btnVerde : styles.btnAzul]}
            onPress={() => setMostrarHistorico(!mostrarHistorico)}
          >
            {mostrarHistorico ? (
              <>
                <Ionicons name="cart-outline" size={20} color="#fff" />
                <Text style={styles.btnAlternarTexto}>Voltar para Lista</Text>
              </>
            ) : (
              <>
                <Ionicons name="time-outline" size={20} color="#fff" />
                <Text style={styles.btnAlternarTexto}>Ver Histórico</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginLeft: 10,
  },
  subtituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginLeft: 8,
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  btnLanchesPredefinidos: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btnLanchesPredefinidosTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  lanchesPredefinidosContainer: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  lanchesPredefinidosRow: {
    justifyContent: 'space-between',
  },
  itemPredefinido: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 4,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
  },
  itemIconeContainer: {
    marginRight: 8,
  },
  itemPredefinidoInfo: {
    flex: 1,
  },
  itemPredefinidoNome: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemPredefinidoPreco: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  btnAdicionar: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnAdicionarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  listaContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mensagemVaziaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mensagemVazia: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontStyle: 'italic',
  },
  itemLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  itemDetalhes: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
  btnRemover: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  btnRemoverTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagamentoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  btnFinalizar: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnFinalizarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  historicoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  historicoItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  historicoData: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  historicoPagamentoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  historicoPagamento: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  historicoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historicoItensContainer: {
    marginTop: 8,
  },
  historicoItensHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  historicoSubitemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
  historicoSubitem: {
    fontSize: 14,
    color: '#555',
  },
  btnAlternar: {
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnVerde: {
    backgroundColor: '#4CAF50',
  },
  btnAzul: {
    backgroundColor: '#2196F3',
  },
  btnAlternarTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});
