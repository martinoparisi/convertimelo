import { Component } from "@angular/core";
import { ImageConverterService } from "../../services/image-converter.service";

@Component({
  selector: "app-image-converter",
  templateUrl: "./image-converter.component.html",
  styleUrls: ["./image-converter.component.css"],
})
export class ImageConverterComponent {
  selectedFile: File | null = null;
  targetFormat: string = "jpeg";
  convertedUrl: string = "";
  loading: boolean = false;
  error: string = "";
  previewUrl: string = "";

  formats = ["jpeg", "png", "webp", "bmp"];

  constructor(private imageService: ImageConverterService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      this.selectedFile = file;
      this.error = "";

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.error = "Seleziona un file immagine valido";
      this.selectedFile = null;
    }
  }

  async convertImage() {
    if (!this.selectedFile) {
      this.error = "Seleziona un file prima di convertire";
      return;
    }

    this.loading = true;
    this.error = "";
    this.convertedUrl = "";

    try {
      const url = await this.imageService.convertImage(
        this.selectedFile,
        this.targetFormat
      );
      this.convertedUrl = url;

      // Auto-download the converted image
      const link = document.createElement("a");
      link.href = url;
      link.download = `converted_${this.selectedFile.name.split(".")[0]}.${
        this.targetFormat
      }`;
      link.click();
    } catch (err: any) {
      this.error = "Errore durante la conversione: " + err.message;
    } finally {
      this.loading = false;
    }
  }

  downloadImage() {
    if (this.convertedUrl) {
      window.open(this.convertedUrl, "_blank");
    }
  }
}
