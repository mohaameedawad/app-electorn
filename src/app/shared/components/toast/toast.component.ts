import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  messages: (ToastMessage & { id: number })[] = [];
  private messageId = 0;

  show(message: ToastMessage) {
    const id = this.messageId++;
    const life = message.life || 3000;
    
    this.messages.push({ ...message, id });

    setTimeout(() => {
      this.remove(id);
    }, life);
  }

  showSuccess(summary: string, detail?: string) {
    this.show({ severity: 'success', summary, detail });
  }

  showInfo(summary: string, detail?: string) {
    this.show({ severity: 'info', summary, detail });
  }

  showWarn(summary: string, detail?: string) {
    this.show({ severity: 'warn', summary, detail });
  }

  showError(summary: string, detail?: string) {
    this.show({ severity: 'error', summary, detail });
  }

  remove(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }

  getIcon(severity: string): string {
    switch (severity) {
      case 'success': return 'pi-check-circle';
      case 'info': return 'pi-info-circle';
      case 'warn': return 'pi-exclamation-triangle';
      case 'error': return 'pi-times-circle';
      default: return 'pi-info-circle';
    }
  }
}
