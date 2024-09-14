import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, ActivityIndicator, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from 'react';

export default function App() {

  const [selectedCurrency, setSelectedCurrency] = useState();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(0);
  const [converted, setConverted] = useState("");


  const personalCode = process.env.EXPO_PUBLIC_PERSONAL_CODE
  var myHeaders = new Headers();
  myHeaders.append("apikey", personalCode);


  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };


  const handleFetch = () => {
    setLoading(true);
    fetch(`https://api.apilayer.com/exchangerates_data/latest`, requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText + response.status);

        return response.json()
      })
      .then(data => setRepositories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    handleFetch()
  }, [])

  useEffect(() => {
    if (repositories.rates && !selectedCurrency) {
      setSelectedCurrency(Object.keys(repositories.rates)[0])
    }
  }, [repositories.rates])

  const conversion = () => {
    const result = number / repositories.rates[selectedCurrency]
    setConverted(result.toFixed(2));
  }

  //console.log(Object.keys(repositories.rates));


  return (

    <View style={styles.container}>

      <Image style={styles.image} source={require('./assets/eurot.png')} />

      <Text style={styles.result}>{converted && converted + "€"}</Text>

      <View style={styles.conversion}>
        <TextInput
          style={styles.inputs}
          onChangeText={number => setNumber(number)}
          value={number}
          keyboardType="numeric"
        ></TextInput>

        <Picker style={styles.picker}
          selectedValue={selectedCurrency || (repositories.rates && Object.keys(repositories.rates)[0])}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCurrency(itemValue)
          }>

          {repositories.rates && Object.keys(repositories.rates).map(currensy => <Picker.Item key={currensy} label={currensy} value={currensy} />)}

        </Picker>

      </View>

      <Button title='CONVERT' onPress={conversion}></Button>

      {loading && <ActivityIndicator size="large" />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs: {
    height: 40,
    width: 80,
    borderBottomWidth: 1,
    fontSize: 18,

  },
  picker: {
    width: 115,
  },
  conversion: {
    flexDirection: "row",
    marginTop: 30
  },
  image: {
    width: 200,
    height: 200,
  },
  result: {
    fontSize: 20
  }
});
