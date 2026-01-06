import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// IMPORTANT: Replace this with the actual IP address of your Next.js server.
// On Android emulator, this is typically 'http://10.0.2.2:3000'
// On a physical device on the same Wi-Fi, it's 'http://<your-computer-ip>:3000'
const NEXTJS_SERVER_URL = 'http://10.0.2.2:3000';
const UPLOAD_API_URL = `${NEXTJS_SERVER_URL}/api/upload-image`;

export default function UploadScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const pickImage = async () => {
    // Request camera roll permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setUploadedUrl(null); // Reset previous upload URL
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please pick an image first.');
      return;
    }

    setUploading(true);
    setUploadedUrl(null);

    const formData = new FormData();
    // The 'uri' property contains the local file path.
    // We need to create a blob-like object to send.
    // The name and type are important for the backend to process the file correctly.
    formData.append('file', {
      uri: image.uri,
      name: image.fileName || `photo_${Date.now()}.jpg`,
      type: image.mimeType || 'image/jpeg',
    } as any);

    // You can append other data if your API needs it, e.g.,
    formData.append('folder', 'cafe-images');


    try {
      const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          // FormData sets the 'Content-Type' header automatically,
          // including the boundary, so we don't set it manually.
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Upload failed');
      }

      setUploadedUrl(responseData.url);
      Alert.alert('Upload Successful', `Image uploaded to: ${responseData.url}`);

    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Error', error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cafe Image Uploader</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <Button title={uploading ? 'Uploading...' : 'Upload Image'} onPress={handleUpload} disabled={uploading} />
        </View>
      )}
      {uploadedUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Upload complete!</Text>
          <Text style={styles.urlText} selectable>{uploadedUrl}</Text>
          <Image source={{ uri: uploadedUrl }} style={styles.uploadedImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  urlText: {
    marginVertical: 10,
    color: 'blue',
  },
  uploadedImage: {
      width: 300,
      height: 300,
      resizeMode: 'contain',
      marginTop: 10,
  }
});