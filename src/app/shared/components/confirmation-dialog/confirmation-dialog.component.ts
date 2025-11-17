import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  visible: boolean = false;
  message: string = '';
  header: string = 'تأكيد';
  acceptLabel: string = 'نعم';
  rejectLabel: string = 'لا';
  showReject: boolean = true;
  
  private acceptCallback?: () => void;
  private rejectCallback?: () => void;

  show(options: {
    message: string;
    header?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    showReject?: boolean;
    accept?: () => void;
    reject?: () => void;
  }) {
    this.message = options.message;
    this.header = options.header || 'تأكيد';
    this.acceptLabel = options.acceptLabel || 'نعم';
    this.rejectLabel = options.rejectLabel || 'لا';
    this.showReject = options.showReject !== undefined ? options.showReject : true;
    this.acceptCallback = options.accept;
    this.rejectCallback = options.reject;
    this.visible = true;
  }

  onAccept() {
    this.visible = false;
    if (this.acceptCallback) {
      this.acceptCallback();
    }
  }

  onReject() {
    this.visible = false;
    if (this.rejectCallback) {
      this.rejectCallback();
    }
  }

  hide() {
    this.visible = false;
  }
}
