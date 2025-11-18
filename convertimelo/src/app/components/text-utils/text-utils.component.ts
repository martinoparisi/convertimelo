import { Component } from "@angular/core";
import { TextUtilsService } from "../../services/text-utils.service";

@Component({
  selector: "app-text-utils",
  templateUrl: "./text-utils.component.html",
  styleUrls: ["./text-utils.component.css"],
})
export class TextUtilsComponent {
  inputText: string = "";
  outputText: string = "";
  searchTerm: string = "";
  operation: string = "stats";

  stats = {
    characters: 0,
    words: 0,
    lines: 0,
    sentences: 0,
  };

  constructor(private textService: TextUtilsService) {}

  processText() {
    if (!this.inputText) {
      this.outputText = "Inserisci del testo per elaborarlo";
      return;
    }

    try {
      switch (this.operation) {
        case "stats":
          this.stats = this.textService.getTextStats(this.inputText);
          this.outputText = `Statistiche:
- Caratteri: ${this.stats.characters}
- Parole: ${this.stats.words}
- Righe: ${this.stats.lines}
- Frasi: ${this.stats.sentences}`;
          break;
        case "uppercase":
          this.outputText = this.textService.toUpperCase(this.inputText);
          break;
        case "lowercase":
          this.outputText = this.textService.toLowerCase(this.inputText);
          break;
        case "titlecase":
          this.outputText = this.textService.toTitleCase(this.inputText);
          break;
        case "sentencecase":
          this.outputText = this.textService.toSentenceCase(this.inputText);
          break;
        case "trim":
          this.outputText = this.textService.trimSpaces(this.inputText);
          break;
        case "reverse":
          this.outputText = this.textService.reverseText(this.inputText);
          break;
        case "summarize":
          this.outputText = this.textService.summarizeText(this.inputText, 3);
          break;
        case "count":
          if (this.searchTerm) {
            const count = this.textService.countOccurrences(
              this.inputText,
              this.searchTerm
            );
            this.outputText = `"${this.searchTerm}" appare ${count} volte nel testo.`;
          } else {
            this.outputText = "Inserisci un termine da cercare";
          }
          break;
        case "removeDuplicates":
          this.outputText = this.textService.removeDuplicateLines(
            this.inputText
          );
          break;
        case "sortAsc":
          this.outputText = this.textService.sortLines(this.inputText, true);
          break;
        case "sortDesc":
          this.outputText = this.textService.sortLines(this.inputText, false);
          break;
        case "base64Encode":
          this.outputText = this.textService.encodeBase64(this.inputText);
          break;
        case "base64Decode":
          this.outputText = this.textService.decodeBase64(this.inputText);
          break;
        case "urlEncode":
          this.outputText = this.textService.encodeURL(this.inputText);
          break;
        case "urlDecode":
          this.outputText = this.textService.decodeURL(this.inputText);
          break;
        default:
          this.outputText = "Operazione non valida";
      }
    } catch (err: any) {
      this.outputText = "Errore: " + err.message;
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.outputText).then(() => {
      alert("Testo copiato negli appunti!");
    });
  }

  clearAll() {
    this.inputText = "";
    this.outputText = "";
    this.searchTerm = "";
  }
}
