import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';
import { marked } from 'marked';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-code-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-indigo-500/20 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]"
    >
      <h2
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
      >
        Code Assistant
      </h2>

      <div class="space-y-6">
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Input (Code or Prompt)</label
            >
            <div class="flex items-center gap-2">
              <span
                *ngIf="isDetectingLanguage"
                class="text-xs text-gray-500 dark:text-gray-400 animate-pulse"
              >
                Detecting language...
              </span>
              <span
                *ngIf="detectedLanguage"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
              >
                {{ detectedLanguage }}
              </span>
            </div>
          </div>
          <textarea
            [(ngModel)]="inputText"
            (ngModelChange)="onInputChange($event)"
            rows="6"
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border placeholder-gray-400 dark:placeholder-gray-500 font-mono"
            placeholder="Paste your code here to explain/detect, or type a prompt to generate code..."
          ></textarea>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <button
            (click)="explainCode()"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            🔍 Explain Code
          </button>
          <button
            (click)="generateCode()"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          >
            ✨ Generate Code
          </button>
        </div>

        <div *ngIf="loading" class="text-center text-gray-500 dark:text-gray-400">
          Processing...
        </div>

        <div *ngIf="result !== null && !loading" class="mt-6">
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
            <button
              (click)="copyResult()"
              class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <span *ngIf="!copied">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </span>
              <span
                *ngIf="copied"
                class="flex items-center gap-1 text-green-600 dark:text-green-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Copied!
              </span>
              <span *ngIf="!copied">Copy</span>
            </button>
          </div>
          <div
            class="p-4 bg-gray-100 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-indigo-500/30 text-gray-900 dark:text-white overflow-x-auto prose dark:prose-invert max-w-none"
            [innerHTML]="parsedResult"
          ></div>
        </div>

        <div
          *ngIf="error"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/30"
        >
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CodeConverterComponent implements OnInit, OnDestroy {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  inputText: string = '';
  result: any = null;
  parsedResult: string = '';
  loading = false;
  error: string | null = null;
  copied = false;

  detectedLanguage: string | null = null;
  isDetectingLanguage = false;
  private inputSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.inputSubject
      .pipe(
        debounceTime(1000), // Wait 1s after typing stops
        distinctUntilChanged(),
        filter((text) => text.length > 10) // Only detect if text is long enough
      )
      .subscribe((text) => {
        this.detectLanguageRealTime(text);
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onInputChange(text: string) {
    this.inputSubject.next(text);
    if (text.length <= 10) {
      this.detectedLanguage = null;
    }
  }

  async detectLanguageRealTime(text: string) {
    this.isDetectingLanguage = true;
    try {
      const prompt = `Identify the programming language of the following code. Respond ONLY with the name of the language (e.g., "Python", "JavaScript", "C++"). If it's not code, respond with "Text".\n\nCode:\n${text}`;
      const resp: any = await this.converterService.generateContent(prompt);
      const lang = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.detectedLanguage = lang.trim();
    } catch (e) {
      console.error('Language detection failed', e);
    } finally {
      this.isDetectingLanguage = false;
    }
  }

  async processWithAI(prompt: string, operationName: string) {
    if (!this.inputText) return;

    this.loading = true;
    this.error = null;
    this.result = null;
    this.parsedResult = '';

    try {
      const resp: any = await this.converterService.generateContent(prompt);
      this.result = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);

      // Parse markdown
      const parsed = await marked.parse(this.result);
      this.parsedResult = parsed;

      this.historyService.addEntry('code', operationName, this.result || '');
    } catch (err: any) {
      console.error(`${operationName} error:`, err);
      this.error = 'An error occurred. Please check your API key or connection.';
      if (err.error?.error?.message) {
        this.error += ` (${err.error.error.message})`;
      }
    } finally {
      this.loading = false;
    }
  }

  explainCode() {
    const prompt = `Explain the following code in detail. Describe what it does, its logic, and any potential issues. Respond in Italian.\n\nCode:\n${this.inputText}`;
    this.processWithAI(prompt, 'Explain Code');
  }

  generateCode() {
    const prompt = `Generate code based on the following description. Provide ONLY the code, with comments if necessary, but no conversational text.\n\nDescription:\n${this.inputText}`;
    this.processWithAI(prompt, 'Generate Code');
  }

  copyResult() {
    if (this.result) {
      navigator.clipboard.writeText(this.result).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    }
  }
}
