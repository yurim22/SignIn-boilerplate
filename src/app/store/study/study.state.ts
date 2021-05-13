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
        console.log('studySeq', studySeq);
        console.log('studyStatus', studyStatus);
        console.log('confirmedBy', confirmedBy);
        // series 정보 전체가 저장된다.
        // setState(state => {
        //     state.hasSelectedStudy = true
        // })
        return this.studyTableService.getSeriesItem(studySeq).pipe(
            tap((res) => {
                console.log('result of get seriestItme', res);
                const state = getState();
                console.log('state info', state);
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    selectedSeries: res,
                    selectedStudyStatus: studyStatus
                });
                console.log(getState());
            })
        );
    }

    @Action(UpdateStudyStatus)
    // tslint:disable-next-line: typedef
    udpateStudyData({getState, setState}: StateContext<StudyStateModel>, {studySeq, confirmedBy}: UpdateStudyStatus) {
        console.log('========confirmedby user name', confirmedBy);
        return this.studyTableService.updateStudyStatus({status: 'REVIEWED'}, studySeq).pipe(
            tap((result) => {
                const state = getState();
                console.log(state);
                const studyList = [...state.allStudies];
                const studyIndex = studyList.findIndex(item => item.seq === studySeq);
                studyList[studyIndex] = result;
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    allStudies: studyList
                });
                console.log(result);
            })
        );
    }

    @Action(GetStudyList)
    // tslint:disable-next-line: typedef
    getStudyList({getState, setState}: StateContext<StudyStateModel>){
        return this.studyTableService.getStudyList().pipe(
            tap((res) => {
                console.log('res in action', res);
                const state = getState();
                setState({
                    ...state,
                    allStudies: res
                });
            })
        );
    }
}
