import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmationDialogData {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: 'warning' | 'danger' | 'info';
}

@Component({
	selector: 'app-confirmation-dialog',
	templateUrl: './confirmation-dialog.component.html',
	styleUrls: ['./confirmation-dialog.component.css'],
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatDialogContent,
		MatButtonModule,
		MatIconModule
	]
})
export class ConfirmationDialogComponent implements OnInit {

	data = inject(MAT_DIALOG_DATA) as ConfirmationDialogData;

	constructor() { }

	ngOnInit(): void {
		// Set defaults if not provided
		this.data.confirmText = this.data.confirmText || 'Confirm';
		this.data.cancelText = this.data.cancelText || 'Cancel';
		this.data.type = this.data.type || 'warning';
	}

	getIconName(): string {
		switch (this.data.type) {
			case 'danger':
				return 'warning';
			case 'warning':
				return 'warning';
			case 'info':
				return 'info';
			default:
				return 'warning';
		}
	}
}
