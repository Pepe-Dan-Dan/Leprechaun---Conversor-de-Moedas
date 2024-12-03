import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState(''); // Pode ser nome de usuário ou email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Para gerenciar mensagens de erro

  const handleLogin = async () => {
    // Verifica se os campos estão vazios
    if (!identifier || !password) {
      setErrorMessage('Por favor, preencha todos os campos!');
      return;
    }

    try {
      // Recuperar credenciais armazenadas
      const storedUsername = await AsyncStorage.getItem('username');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      // Validar credenciais
      if (
        (identifier === storedUsername || identifier === storedEmail) &&
        password === storedPassword
      ) {
        Alert.alert('Login bem-sucedido', 'Bem-vindo!');
        navigation.navigate('Home'); // Redireciona para a tela principal
      } else {
        setErrorMessage('Credenciais inválidas!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível recuperar as credenciais.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/LoginConversor.gif')} // Substitua pelo caminho da sua imagem ou GIF
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário ou Email"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            setErrorMessage(''); // Limpa o erro ao digitar
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage(''); // Limpa o erro ao digitar
          }}
          secureTextEntry
        />

        {/* Botão Entrar estilizado */}
        <TouchableOpacity style={styles.customButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão de Cadastro como link */}
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkText}>
            {' '}
            Ainda não tem uma conta? Cadastre-se!{' '}
          </Text>
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
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255)', // Fundo semitransparente para contraste
    margin: 20,
    borderRadius: 10,
    paddingTop: 150, // Adiciona 5 cm de espaçamento superior
  },
  //login
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  //textbox
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  //mensagem de erro
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  //botao entrar
  customButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 10,
    alignItems: 'center',
  },
   //texto botao
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  //link para cadastro
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#619eff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
