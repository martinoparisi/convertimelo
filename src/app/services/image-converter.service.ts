import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  async convertImage(file: File, targetFormat: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Cannot get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          // Convert to target format
          const mimeType = this.getMimeType(targetFormat);
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Conversion failed'));
              return;
            }
            
            // Upload to Firebase Storage
            const storageRef = ref(this.storage, `converted/${Date.now()}_${file.name.split('.')[0]}.${targetFormat}`);
            uploadBytes(storageRef, blob).then(() => {
              return getDownloadURL(storageRef);
            }).then((url) => {
              // Save metadata to Firestore
              const conversionsRef = collection(this.firestore, 'conversions');
              addDoc(conversionsRef, {
                originalName: file.name,
                targetFormat: targetFormat,
                timestamp: new Date(),
                url: url
              });
              
              resolve(url);
            }).catch(reject);
          }, mimeType);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private getMimeType(format: string): string {
    const mimeTypes: { [key: string]: string } = {
      'jpeg': 'image/jpeg',
      'jpg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    return mimeTypes[format.toLowerCase()] || 'image/png';
  }

  async getConversionHistory() {
    const conversionsRef = collection(this.firestore, 'conversions');
    const snapshot = await getDocs(conversionsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
