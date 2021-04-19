import { Patient } from "./patient.model";

export class StudyRow{
    status: string;
    study_date: string;
    results: number;
    analysis_date: string;
    patient: Patient
}