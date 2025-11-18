import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TextUtilsService {
  constructor(private http: HttpClient) {}

  // Character and word count
  getTextStats(text: string): {
    characters: number;
    words: number;
    lines: number;
    sentences: number;
  } {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split("\n").length;
    const sentences = text
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;

    return { characters, words, lines, sentences };
  }

  // Convert case
  toUpperCase(text: string): string {
    return text.toUpperCase();
  }

  toLowerCase(text: string): string {
    return text.toLowerCase();
  }

  toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  toSentenceCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  // Remove extra spaces
  trimSpaces(text: string): string {
    return text.replace(/\s+/g, " ").trim();
  }

  // Reverse text
  reverseText(text: string): string {
    return text.split("").reverse().join("");
  }

  // Simple summarization (extracts first few sentences)
  summarizeText(text: string, maxSentences: number = 3): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, maxSentences).join(" ").trim();
  }

  // Count occurrences
  countOccurrences(text: string, searchTerm: string): number {
    if (!searchTerm) return 0;
    const regex = new RegExp(searchTerm, "gi");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  }

  // Remove duplicates lines
  removeDuplicateLines(text: string): string {
    const lines = text.split("\n");
    const uniqueLines = [...new Set(lines)];
    return uniqueLines.join("\n");
  }

  // Sort lines
  sortLines(text: string, ascending: boolean = true): string {
    const lines = text.split("\n");
    lines.sort((a, b) => {
      if (ascending) {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    return lines.join("\n");
  }

  // Encode/Decode Base64
  encodeBase64(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
      throw new Error("Error encoding to Base64");
    }
  }

  decodeBase64(text: string): string {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (e) {
      throw new Error("Error decoding from Base64");
    }
  }

  // URL Encode/Decode
  encodeURL(text: string): string {
    return encodeURIComponent(text);
  }

  decodeURL(text: string): string {
    return decodeURIComponent(text);
  }
}
