import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {
  constructor() {}

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
            
            // Create a downloadable URL
            const url = URL.createObjectURL(blob);
            
            // Note: In production, you would upload to Firebase Storage here
            // For now, we're just creating a local blob URL
            resolve(url);
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
}
