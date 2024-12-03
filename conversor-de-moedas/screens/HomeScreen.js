import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [value, setValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);
  const [convertedBRL, setConvertedBRL] = useState('');
  const [convertedUSD, setConvertedUSD] = useState('');
  const [convertedEUR, setConvertedEUR] = useState('');
  const [isGif1, setIsGif1] = useState(true); // Estado para alternar os GIFs

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Erro ao recuperar o nome do usuário:', error);
      }
    };

    fetchUser();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await fetch(
        'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL'
      );
      const data = await response.json();

      setUsdRate(parseFloat(data.USDBRL.ask));
      setEurRate(parseFloat(data.EURBRL.ask));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter as cotações.');
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleValueChange = (value) => {
    setValue(value);

    if (value && usdRate && eurRate) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        if (selectedCurrency === 'BRL') {
          setConvertedUSD((numericValue / usdRate).toFixed(2));
          setConvertedEUR((numericValue / eurRate).toFixed(2));
          setConvertedBRL(value);
        } else if (selectedCurrency === 'USD') {
          setConvertedBRL((numericValue * usdRate).toFixed(2));
          setConvertedUSD(value);
          setConvertedEUR(((numericValue * usdRate) / eurRate).toFixed(2));
        } else if (selectedCurrency === 'EUR') {
          setConvertedBRL((numericValue * eurRate).toFixed(2));
          setConvertedEUR(value);
          setConvertedUSD(((numericValue * eurRate) / usdRate).toFixed(2));
        }
      } else {
        setConvertedBRL('');
        setConvertedUSD('');
        setConvertedEUR('');
      }
    } else {
      setConvertedBRL('');
      setConvertedUSD('');
      setConvertedEUR('');
    }
  };

  return (
    <ImageBackground
      source={
        isGif1
          ? require('../assets/HOMEconversorClaro.gif') // primeiro GIF
          : require('../assets/HOMEconversorEscuro.gif') // segundo GIF
      }
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.appName}>Leprechaun</Text>
        <Text style={styles.floatingText}>
          Bem-vindo ao Conversor de Moedas, {username}!
        </Text>

        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => {
            setSelectedCurrency(itemValue);
            setValue('');
            setConvertedBRL('');
            setConvertedUSD('');
            setConvertedEUR('');
          }}
          style={styles.picker}
          itemStyle={styles.pickerItem}>
          <Picker.Item label="BRL" value="BRL" />
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder={`Digite um valor em ${selectedCurrency}`}
          keyboardType="numeric"
          value={value}
          onChangeText={handleValueChange}
        />

        {/* Tabela com valores convertidos */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header]}>BRL</Text>
            <Text style={[styles.cell, styles.header]}>USD</Text>
            <Text style={[styles.cell, styles.header]}>EUR</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>{convertedBRL || '-'}</Text>
            <Text style={styles.cell}>{convertedUSD || '-'}</Text>
            <Text style={styles.cell}>{convertedEUR || '-'}</Text>
          </View>
        </View>

        {/* Botão de alternância para mudar o GIF */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Alternar Fundo</Text>
          <Switch
            value={isGif1}
            onValueChange={(value) => setIsGif1(value)}
            thumbColor={isGif1 ? '#6200EE' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Botão customizado de Sair */}
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  //gifs
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  //componentes na tela
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  //Leprechaun
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 60,
  },
  //mensagem de bem vindo
  floatingText: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  //picker box
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  //dentro da picker box 
  pickerItem: {
    fontSize: 25,
    color: '#000000',
    fontWeight: 'bold',
  },
  //textbox
  input: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  //tabela
  table: {
    marginTop: 20,
    width: 350,
    height: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  //linhas da tabela
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  //cabeçalho da tabela
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  //corpo da tabela
  cell: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    width: '33.33%',
  },
  //botao de sair
  customButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
  }, 
  //texto botao
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  //interruptor
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  //texto interruptor
  switchText: {
    marginRight: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 65, 25, 0.7)', // Cor de fundo com transparência
    padding: 5, // Espaçamento interno
    borderRadius: 5, // Bordas arredondadas
  },
});
