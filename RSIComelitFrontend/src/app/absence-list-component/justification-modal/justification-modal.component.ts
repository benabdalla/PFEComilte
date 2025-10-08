import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AbsenceService } from '../../shared/service/absence.service';

@Component({
  selector: 'app-justification-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './justification-modal.component.html',
  styleUrl: './justification-modal.component.scss'
})
export class JustificationModalComponent {
  absence: any;
  isValidating = false;

  constructor(
    public dialogRef: MatDialogRef<JustificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private absenceService: AbsenceService,
    private snackBar: MatSnackBar
  ) {
    this.absence = data.absence;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onValidate(): void {
    if (!this.absence?.id) {
      this.snackBar.open('Error: No absence ID found', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isValidating = true;

    this.absenceService.validateAbsence(this.absence.id).subscribe({
      next: (validatedAbsence) => {
        console.log('Validation successful:', validatedAbsence);
        this.snackBar.open('Absence validated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Update local absence status
        this.absence.status = validatedAbsence.status || 'VALID';

        this.dialogRef.close({ action: 'validated', absence: validatedAbsence });
        this.isValidating = false;
      },
      error: (error) => {
        console.error('Error validating absence:', error);
        this.snackBar.open('Error validating absence. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isValidating = false;
      }
    });
  }

  downloadFile(): void {
    if (!this.absence?.justificationFile) {
      this.snackBar.open('No file to download', 'Close', {
        duration: 2000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    console.log('Downloading file:', this.absence.justificationFile);
    console.log('Absence data:', this.absence);

    // Check if we have files array with file IDs (new structure)
    if (this.absence.files && this.absence.files.length > 0) {
      const file = this.absence.files[0]; // Download first file
      console.log('Using new file structure:', file);

      this.absenceService.downloadAbsenceFile(this.absence.id, file.id).subscribe({
        next: (blob) => {
          this.downloadBlob(blob, file.originalFilename || 'justification-file');
        },
        error: (error) => {
          console.error('Error downloading file with new method:', error);
          this.snackBar.open('Error downloading file. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Try using filename directly as file ID or create a direct download URL
      console.log('Using fallback method for file:', this.absence.justificationFile);

      // Extract just the filename without the uploads/ path
      const filename = this.absence.justificationFile.replace('uploads/', '').replace('uploads\\', '');
      console.log('Cleaned filename:', filename);

      // Try direct file download using the backend file serving endpoint
      const fileUrl = `http://localhost:8080/uploads/${filename}`;
      console.log('Trying direct download URL:', fileUrl);

      // Create direct download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.snackBar.open('File download initiated!', 'Close', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    this.snackBar.open('File downloaded successfully!', 'Close', {
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }

  canValidate(): boolean {
    console.log('canValidate check:', {
      absenceStatus: this.absence?.status,
      isValidating: this.isValidating,
      absence: this.absence
    });

    if (!this.absence || this.isValidating) {
      return false;
    }

    // Check if status is justified (case-insensitive and handle variations)
    const status = this.absence.status?.toUpperCase();
    return status === 'JUSTIFIED' || status === 'PENDING_VALIDATION';
  }
}
