/**
 * Popup UI Controller
 * Manages the configuration UI for the Moodle Quiz Solver extension.
 */

const BACKEND_URL = 'https://quizsolverformoodle.com';

class PopupController {
  private apiKeyInput: HTMLInputElement;
  private modelSelect: HTMLSelectElement;
  private reasoningSelect: HTMLSelectElement;
  private contextTextarea: HTMLTextAreaElement;
  private saveBtn: HTMLButtonElement;
  private setupBtn: HTMLButtonElement;
  private configForm: HTMLElement;
  private setupView: HTMLElement;
  private creditsBadge: HTMLElement;
  private modelLoading: HTMLElement;

  constructor() {
    this.apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    this.modelSelect = document.getElementById('model') as HTMLSelectElement;
    this.reasoningSelect = document.getElementById('reasoning') as HTMLSelectElement;
    this.contextTextarea = document.getElementById('context') as HTMLTextAreaElement;
    this.saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
    this.setupBtn = document.getElementById('setup-btn') as HTMLButtonElement;
    this.configForm = document.getElementById('config-form') as HTMLElement;
    this.setupView = document.getElementById('setup-view') as HTMLElement;
    this.creditsBadge = document.getElementById('credits-badge') as HTMLElement;
    this.modelLoading = document.getElementById('model-loading') as HTMLElement;

    this.init();
  }

  private async init(): Promise<void> {
    await this.loadConfig();
    this.setupEventListeners();
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.sendMessage<{config: any | null}>('GET_CONFIG');
      if (config?.config) {
        this.populateForm(config.config);
        this.showConfig();
        this.updateCredits(config.config.credits);

        // Load models if API key is present
        if (config.config.apiKey) {
          await this.loadModels(config.config.apiKey);
        }
      } else {
        this.showSetup();
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      this.showSetup();
    }
  }

  private async loadModels(apiKey: string): Promise<void> {
    this.modelLoading.style.display = 'block';
    this.modelSelect.disabled = true;

    try {
      const result = await this.sendMessage<{models: any[]}>('GET_MODELS', { apiKey });
      if (result?.models) {
        this.modelSelect.innerHTML = '';
        for (const model of result.models) {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = `${model.id}${model.is_default ? ' (Default)' : ''}`;
          if (model.id === this.apiKeyInput.value) option.selected = true;
          this.modelSelect.appendChild(option);
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      this.modelLoading.textContent = 'Failed to load models. Check your API key.';
    } finally {
      this.modelLoading.style.display = 'none';
      this.modelSelect.disabled = false;
    }
  }

  private populateForm(config: any): void {
    this.apiKeyInput.value = config.apiKey || '';
    if (config.model) {
      const option = this.modelSelect.querySelector(`option[value="${config.model}"]`);
      if (option) (option as HTMLOptionElement).selected = true;
    }
    this.reasoningSelect.value = config.reasoning || 'low';
    this.contextTextarea.value = config.context || '';
  }

  private showConfig(): void {
    this.setupView.style.display = 'none';
    this.configForm.style.display = 'block';
  }

  private showSetup(): void {
    this.configForm.style.display = 'none';
    this.setupView.style.display = 'block';
  }

  private updateCredits(credits: number | undefined): void {
    this.creditsBadge.textContent = credits !== undefined ? `${credits} credits` : '';
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
      this.apiKeyInput.focus();
    });

    this.saveBtn.addEventListener('click', async () => {
      const config = {
        apiKey: this.apiKeyInput.value.trim(),
        model: this.modelSelect.value,
        reasoning: this.reasoningSelect.value,
        context: this.contextTextarea.value,
        cursor: true,
        fillOnClick: false,
      };

      if (!config.apiKey) {
        alert('Please enter an API key.');
        return;
      }

      this.saveBtn.disabled = true;
      this.saveBtn.textContent = 'Saving...';

      try {
        await this.sendMessage('SET_CONFIG', { config });
        this.updateCredits(config.credits);

        // Verify API key and load models
        await this.loadModels(config.apiKey);
        this.saveBtn.textContent = 'Saved!';
        setTimeout(() => { this.saveBtn.textContent = 'Save'; this.saveBtn.disabled = false; }, 2000);
      } catch (error) {
        this.saveBtn.disabled = false;
        this.saveBtn.textContent = 'Save';
        alert(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});