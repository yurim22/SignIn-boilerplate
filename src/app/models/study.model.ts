import { StudyRow } from './studyrow.model';

export class Study extends StudyRow {
    onAnalysing = false;
    status = '';
    host: string;
    port: number;

    constructor() {
        super();
    }
    setStatusExamined(): void {
        this.status = 'Examined';
    }
    setStatusAnalysing(): void {
        this.status = 'Analysing';
    }
    setStatusAnalysed(): void {
        this.status = 'Analysed';
    }
    setStatusDeleting(): void {
        this.status = 'Deleting';
    }
    setStatusTranscribing(): void {
        this.status = 'Transcribing';
    }
    setStatusTranscribed(): void {
        this.status = 'Transcribed';
    }
    setStatusApproved(): void {
        this.status = 'Approved';
    }
    setStatusReviewed(): void {
        this.status = 'Reviewed'
    }
    isExamined(): boolean {
        if (this.status === 'Examined') {
            return true;
        } else {
            return false;
        }
    }
    isAnalysing(): boolean {
        if (this.status === 'Analysing') {
            return true;
        } else {
            return false;
        }
    }
    isDeleting(): boolean {
        if (this.status === 'Deleting') {
            return true;
        } else {
            return false;
        }
    }
    isAnalysed(): boolean {
        if (this.status === 'Analysed') {
            return true;
        } else {
            return false;
        }
    }
    isTranscribing(): boolean {
        if (this.status === 'Transcribing') {
            return true;
        } else {
            return false;
        }
    }
    isTranscribed(): boolean {
        if (this.status === 'Transcribed') {
            return true;
        } else {
            return false;
        }
    }
    isApproved(): boolean {
        if (this.status === 'Approved') {
            return true;
        } else {
            return false;
        }
    }
}