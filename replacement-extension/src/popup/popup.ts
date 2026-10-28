/**
 * Popup UI Controller
 * BYOK - Configure AI provider (OpenAI, Anthropic, OpenRouter, Ollama, Custom)
 */

import { PROVIDER_PRESETS, ExtensionConfig, STORAGE_KEYS } from '../shared/types.js';

class PopupController {
  private providerSelect: HTMLSelectElement;
  private baseUrlInput: HTMLInputElement;
  private apiKeyInput: HTMLInputElement;
  private modelSelect: HTMLSelectElement;
  private modelManualInput: HTMLInputElement;
  private reasoningSelect: HTMLSelectElement;
  private temperatureInput: HTMLInputElement;
  private maxTokensInput: HTMLInputElement;
  private contextTextarea: HTMLTextAreaElement;
  private cursorCheckbox: HTMLInputElement;
  private fillOnClickCheckbox: HTMLInputElement;
  private stealthModeCheckbox: HTMLInputElement;
  private saveBtn: HTMLButtonElement;
  private testBtn: HTMLButtonElement;
  private setupBtn: HTMLButtonElement;
  private configForm: HTMLElement;
  private setupView: HTMLElement;
  private tokensBadge: HTMLElement;
  private modelLoading: HTMLElement;

  constructor() {
    this.providerSelect = document.getElementById('provider') as HTMLSelectElement;
    this.baseUrlInput = document.getElementById('base-url') as HTMLInputElement;
    this.apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    this.modelSelect = document.getElementById('model') as HTMLSelectElement;
    this.modelManualInput = document.getElementById('model-manual') as HTMLInputElement;
    this.reasoningSelect = document.getElementById('reasoning') as HTMLSelectElement;
    this.temperatureInput = document.getElementById('temperature') as HTMLInputElement;
    this.maxTokensInput = document.getElementById('max-tokens') as HTMLInputElement;
    this.contextTextarea = document.getElementById('context') as HTMLTextAreaElement;
    this.cursorCheckbox = document.getElementById('cursor') as HTMLInputElement;
    this.fillOnClickCheckbox = document.getElementById('fill-on-click') as HTMLInputElement;
    this.stealthModeCheckbox = document.getElementById('stealth-mode') as HTMLInputElement;
    this.saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    this.testBtn = document.getElementById('test-btn') as HTMLButtonElement;
    this.setupBtn = document.getElementById('setup-btn') as HTMLButtonElement;
    this.configForm = document.getElementById('config-form') as HTMLElement;
    this.setupView = document.getElementById('setup-view') as HTMLElement;
    this.tokensBadge = document.getElementById('tokens-badge') as HTMLElement;
    this.modelLoading = document.getElementById('model-loading') as HTMLElement;

    this.init();
  }

  private async init(): Promise<void> {
    this.populateProviders();
    await this.loadConfig();
    this.setupEventListeners();
  }

  private populateProviders(): void {
    this.providerSelect.innerHTML = '';
    for (const [key, preset] of Object.entries(PROVIDER_PRESETS)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = preset.name;
      this.providerSelect.appendChild(option);
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.sendMessage<{ config: ExtensionConfig | null }>('GET_CONFIG');
      if (config?.config) {
        this.populateForm(config.config);
        this.showConfig();
        this.updateTokens(config.config.provider);
      } else {
        this.showSetup();
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      this.showSetup();
    }
  }

  private async loadModels(providerConfig: ExtensionConfig['provider']): Promise<void> {
    this.modelLoading.style.display = 'block';
    this.modelSelect.disabled = true;

    try {
      const result = await this.sendMessage<{ models: Array<{ id: string; name?: string; is_default?: boolean }> }>('GET_MODELS', { config: providerConfig });
      if (result?.models) {
        this.modelSelect.innerHTML = '';
        for (const model of result.models) {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.name || model.id;
          if (model.is_default) option.selected = true;
          this.modelSelect.appendChild(option);
        }
        // If we have a saved model that's not in the list, add it
        const savedModel = providerConfig.model;
        if (savedModel && ![...this.modelSelect.options].some(o => o.value === savedModel)) {
          const option = document.createElement('option');
          option.value = savedModel;
          option.textContent = `${savedModel} (saved)`;
          option.selected = true;
          this.modelSelect.appendChild(option);
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      this.modelLoading.textContent = 'Failed to load models. Check your API key and base URL. You can still enter a model ID manually.';
    } finally {
      this.modelLoading.style.display = 'none';
      this.modelSelect.disabled = false;
      this.modelManualInput.style.display = 'block';
    }
  }

  private populateForm(config: ExtensionConfig): void {
    const { provider, fillOnClick, cursor, context, stealthMode } = config;
    this.providerSelect.value = provider.provider;
    this.baseUrlInput.value = provider.baseUrl || '';
    this.apiKeyInput.value = provider.apiKey || '';
    
    // Set model - check if it's in the dropdown, otherwise use manual input
    const modelInDropdown = [...this.modelSelect.options].some(o => o.value === provider.model);
    if (modelInDropdown) {
      this.modelSelect.value = provider.model || '';
      this.modelManualInput.value = '';
      this.modelManualInput.style.display = 'none';
    } else if (provider.model) {
      this.modelSelect.value = '';
      this.modelManualInput.value = provider.model;
      this.modelManualInput.style.display = 'block';
    } else {
      this.modelManualInput.style.display = 'block';
    }
    
    this.reasoningSelect.value = provider.reasoning || 'low';
    this.temperatureInput.value = provider.temperature?.toString() || '0.1';
    this.maxTokensInput.value = provider.maxTokens?.toString() || '4000';
    this.contextTextarea.value = context || '';
    this.cursorCheckbox.checked = cursor !== false;
    this.fillOnClickCheckbox.checked = fillOnClick !== false;
    this.stealthModeCheckbox.checked = stealthMode === true;
    this.updateBaseUrlPlaceholder();
    this.updateModelLoading(provider);
  }

  private updateBaseUrlPlaceholder(): void {
    const provider = this.providerSelect.value;
    const preset = PROVIDER_PRESETS[provider as keyof typeof PROVIDER_PRESETS];
    if (preset) {
      this.baseUrlInput.placeholder = preset.baseUrl;
    }
  }

  private updateModelLoading(providerConfig: ExtensionConfig['provider']): void {
    if (!providerConfig.apiKey && providerConfig.provider !== 'ollama' && providerConfig.provider !== 'custom') {
      this.modelLoading.textContent = 'Enter API key to load models';
      this.modelLoading.style.display = 'block';
      this.modelSelect.disabled = true;
    } else {
      this.modelLoading.style.display = 'none';
      this.modelSelect.disabled = false;
    }
  }

  private showConfig(): void {
    this.setupView.style.display = 'none';
    this.configForm.style.display = 'block';
  }

  private showSetup(): void {
    this.configForm.style.display = 'none';
    this.setupView.style.display = 'block';
  }

  private updateTokens(providerConfig: ExtensionConfig['provider']): void {
    // Could fetch from storage if we track per-provider tokens
    this.tokensBadge.textContent = 'Ready';
  }

  private sendMessage<T = any>(type: string, payload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type, payload }, (response) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else if (response?.success) resolve(response as T);
        else reject(new Error(response?.error || 'Unknown error'));
      });
    });
  }

  private setupEventListeners(): void {
    this.setupBtn.addEventListener('click', () => {
      this.showConfig();
      this.providerSelect.focus();
    });

    this.providerSelect.addEventListener('change', () => {
      this.updateBaseUrlPlaceholder();
      const provider = this.providerSelect.value;
      const preset = PROVIDER_PRESETS[provider as keyof typeof PROVIDER_PRESETS];
      if (preset && !this.baseUrlInput.value) {
        this.baseUrlInput.value = preset.baseUrl;
      }
      if (preset && !this.modelSelect.value) {
        // Will be populated when models load
      }
      this.updateModelLoading({
        provider: provider as any,
        baseUrl: this.baseUrlInput.value || preset?.baseUrl || '',
        apiKey: this.apiKeyInput.value,
        model: this.modelSelect.value,
      });
    });

    this.baseUrlInput.addEventListener('input', () => {
      this.updateModelLoading({
        provider: this.providerSelect.value as any,
        baseUrl: this.baseUrlInput.value,
        apiKey: this.apiKeyInput.value,
        model: this.modelSelect.value,
      });
    });

    this.apiKeyInput.addEventListener('input', () => {
      this.updateModelLoading({
        provider: this.providerSelect.value as any,
        baseUrl: this.baseUrlInput.value,
        apiKey: this.apiKeyInput.value,
        model: this.modelSelect.value,
      });
    });

    this.testBtn.addEventListener('click', async () => {
      const config = this.getFormConfig();
      if (!config.provider.apiKey && config.provider.provider !== 'ollama') {
        alert('Please enter an API key first.');
        return;
      }

      this.testBtn.disabled = true;
      this.testBtn.textContent = 'Testing...';

      try {
        const result = await this.sendMessage<{ valid: boolean; models?: string[] }>('CHECK_API_KEY', { config: config.provider });
        if (result.valid) {
          alert('Connection successful!');
          await this.loadModels(config.provider);
        } else {
          alert('Connection failed. Check your API key and base URL.');
        }
      } catch (error) {
        alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        this.testBtn.disabled = false;
        this.testBtn.textContent = 'Test Connection';
      }
    });

    this.saveBtn.addEventListener('click', async () => {
      const config = this.getFormConfig();

      if (!config.provider.apiKey && config.provider.provider !== 'ollama') {
        alert('Please enter an API key.');
        return;
      }
      if (!config.provider.model) {
        alert('Please select a model.');
        return;
      }

      this.saveBtn.disabled = true;
      this.saveBtn.textContent = 'Saving...';

      try {
        await this.sendMessage('SET_CONFIG', { config });
        this.updateTokens(config.provider);
        await this.loadModels(config.provider);
        this.saveBtn.textContent = 'Saved!';
        setTimeout(() => { this.saveBtn.textContent = 'Save'; this.saveBtn.disabled = false; }, 2000);
      } catch (error) {
        this.saveBtn.disabled = false;
        this.saveBtn.textContent = 'Save';
        alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  private getFormConfig(): ExtensionConfig {
    // Use manual input if dropdown is empty and manual has value
    const model = this.modelSelect.value || this.modelManualInput.value.trim();
    return {
      provider: {
        provider: this.providerSelect.value as any,
        baseUrl: this.baseUrlInput.value.trim(),
        apiKey: this.apiKeyInput.value.trim(),
        model,
        reasoning: this.reasoningSelect.value,
        temperature: parseFloat(this.temperatureInput.value) || 0.1,
        maxTokens: parseInt(this.maxTokensInput.value) || 4000,
      },
      fillOnClick: this.fillOnClickCheckbox.checked,
      cursor: this.cursorCheckbox.checked,
      context: this.contextTextarea.value,
      stealthMode: this.stealthModeCheckbox.checked,
    };
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});