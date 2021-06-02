import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Series } from 'src/app/models/series.model';
import { StudyRow } from 'src/app/models/studyrow.model';
import { StudyTableService } from 'src/app/webviewer-main/study-table/study-table.service';
import { GetStudyList, SetSeriesInfo, UpdateStudyStatus } from './study.actions';

export interface StudyStateModel {
    selectedSeries: Series;
    hasSelectedStudy: boolean;
    selectedStudyStatus: string;
    allStudies: StudyRow[];
    confirmUser: string;
}

@State<StudyStateModel>({
    name: 'study',
    defaults: {
        selectedSeries: null,
        hasSelectedStudy: false,
        selectedStudyStatus: undefined,
        confirmUser: undefined,
        allStudies: [],
    }
})

@Injectable()
export class StudyState {
    constructor(private studyTableService: StudyTableService) {
    }

    @Selector()
    static getSeriesUrl(state: StudyStateModel): string {
        return state.selectedSeries.image_url;
    }

    @Selector()
    static getStudySeq(state: StudyStateModel): number {
        return state.selectedSeries.study_seq;
    }

    @Selector()
    static selectedStudyStatus(state: StudyStateModel): string {
        return state.selectedStudyStatus;
    }

    @Selector()
    static getStudyList(state: StudyStateModel): StudyRow[] {
        return state.allStudies;
    }

    @Selector()
    static getConfirmedBy(state: StudyStateModel): string {
        return state.confirmUser;
    }

    @Action(SetSeriesInfo)
    // tslint:disable-next-line: typedef
    setSeriesInfo({getState, setState}: StateContext<StudyStateModel>, {studySeq, studyStatus, confirmedBy}: SetSeriesInfo){
        return this.studyTableService.getSeriesItem(studySeq).pipe(
            tap((res) => {
                // res : series image_url 결과
                const state = getState();
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    selectedSeries: res,
                    selectedStudyStatus: studyStatus
                });
            })
        );
    }

    @Action(UpdateStudyStatus)
    // tslint:disable-next-line: typedef
    udpateStudyData({getState, setState}: StateContext<StudyStateModel>, {studySeq, confirmedBy}: UpdateStudyStatus) {
        return this.studyTableService.updateStudyStatus({status: 'REVIEWED'}, studySeq).pipe(
            tap((result) => {
                const state = getState();
                const studyList = [...state.allStudies];
                const studyIndex = studyList.findIndex(item => item.seq === studySeq);
                studyList[studyIndex] = result;
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    allStudies: studyList
                });
            })
        );
    }

    @Action(GetStudyList)
    // tslint:disable-next-line: typedef
    getStudyList({getState, setState}: StateContext<StudyStateModel>, filter){
        console.log(filter.filterStatus);
        return this.studyTableService.getStudyList(filter.filterStatus).pipe(
            tap((res) => {
                const state = getState();
                setState({
                    ...state,
                    allStudies: res
                });
            })
        );
    }
}
