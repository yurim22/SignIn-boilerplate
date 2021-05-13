import { Patient } from './patient.model';

export class StudyRow{
    status: string;
    study_date: string;
    results: number;
    analysis_date: Date;
    patient: Patient;
    seq: number;
    volumes: number;
    confirmed_by: string;
}
