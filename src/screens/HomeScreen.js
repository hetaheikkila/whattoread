import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

export default function HomeScreen() {
  const [searchType, setSearchType] = useState('book'); // 'book' or 'author'
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    try {
      if (searchType === 'book') {
        const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResult(data.docs.slice(0, 10));
      } else { //hae kirjailijan nimellä
        const res = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResult({ authors: data.docs.slice(0, 10), works: null });
      }
    } catch (error) {
      console.error('Hakivirhe:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorWorks = async (authorKey) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org${authorKey}/works.json`);
      const data = await res.json();
      setResult({ authors: null, works: data.entries.slice(0, 10) });
    } catch (error) {
      console.error('Virhe haettaessa teoksia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>OpenLibrary-haku</Text>

      {/* Hakutyyppi */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === 'book' && styles.activeToggle,
          ]}
          onPress={() => setSearchType('book')}
        >
          <Text style={styles.toggleText}>Teoksen nimellä</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === 'author' && styles.activeToggle,
          ]}
          onPress={() => setSearchType('author')}
        >
          <Text style={styles.toggleText}>Kirjailijan nimellä</Text>
        </TouchableOpacity>
      </View>

      {/* Hakukenttä */}
      <TextInput
        placeholder={searchType === 'book' ? 'Syötä kirjan nimi' : 'Syötä kirjailijan nimi'}
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Hae" onPress={handleSearch} />

      {/* Ladataan... */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Hakutulokset */}
      {result && (
        <View style={styles.result}>
          {/* Teoshaku */}
          {searchType === 'book' && Array.isArray(result) && result.map((item, index) => (
            <View key={index} style={styles.item}>
              {item.cover_i ? (
                <Image
                  source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }}
                  style={styles.coverImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.coverImage, styles.noCover]}>
                  <Text style={{ color: '#999' }}>Ei kuvaa</Text>
                </View>
              )}
              <Text style={styles.title}>{item.title}</Text>
              {item.author_name && (
                <Text>Kirjailija: {item.author_name.join(', ')}</Text>
              )}
              {item.first_publish_year && (
                <Text>Julkaisuvuosi: {item.first_publish_year}</Text>
              )}
            </View>
          ))}

          {/* Kirjailijahaku */}
          {result.authors && result.authors.map((author, idx) => (
            <View key={idx} style={styles.item}>
              <TouchableOpacity onPress={() => fetchAuthorWorks(author.key)}>
                <Text style={[styles.title, styles.link]}>
                  {author.name}
                </Text>
              </TouchableOpacity>
              {author.birth_date && <Text>Syntymäaika: {author.birth_date}</Text>}
              {author.top_work && <Text>Tunnetuin teos: {author.top_work}</Text>}
            </View>
          ))}

          {/* Kirjailijan teokset */}
          {result.works && result.works.map((work, idx) => (
            <View key={idx} style={styles.item}>
              <Text style={styles.title}>{work.title}</Text>
              {work.first_publish_date && (
                <Text>Julkaistu: {work.first_publish_date}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ccc',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  result: {
    marginTop: 20,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  link: {
    color: '#007AFF',
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  noCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
