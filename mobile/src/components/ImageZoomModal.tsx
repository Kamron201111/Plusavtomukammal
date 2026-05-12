import React from 'react';
import { Modal, View, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ImageZoomModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageZoomModal({ visible, imageUrl, onClose }: ImageZoomModalProps) {
  const insets = useSafeAreaInsets();

  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container} className="bg-black/95">
        <TouchableOpacity 
          style={[styles.closeButton, { top: insets.top + 20 }]}
          onPress={onClose}
          className="bg-white/10 rounded-full p-2 border border-white/20"
        >
          <X color="white" size={24} />
        </TouchableOpacity>

        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  imageWrapper: {
    width: width,
    height: height * 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
