import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    selectedStudyInstanceUid: string;
}

@State<StudyStateModel>({
    name: 'study',
    defaults: {
        selectedSeries: null,
        hasSelectedStudy: false,
        selectedStudyStatus: undefined,
        confirmUser: undefined,
        allStudies: [],
        selectedStudyInstanceUid: undefined,
    }
})

@Injectable()
export class StudyState {
    constructor(private studyTableService: StudyTableService) {
    }

    @Selector()
    static getSeriesUrl(state: StudyStateModel): string {
        const imageUrl = `http://210.114.91.205:9435/study/studies/${state.selectedStudyInstanceUid}/series/${state.selectedSeries.series_instance_uid}/instances/`;
        console.log(imageUrl);
        return imageUrl;
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
    setSeriesInfo({getState, setState}: StateContext<StudyStateModel>,
                  {studySeq, studyStatus, confirmedBy, studyInstanceUid}: SetSeriesInfo){
        return this.studyTableService.getSeriesItem(studySeq).pipe(
            tap((res) => {
                // res : series image_url 결과
                console.log(res);
                const state = getState();
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    selectedSeries: res,
                    selectedStudyStatus: studyStatus,
                    selectedStudyInstanceUid: studyInstanceUid
                });
            })
        );
    }

    @Action(UpdateStudyStatus)
    // tslint:disable-next-line: typedef
    udpateStudyData({getState, setState}: StateContext<StudyStateModel>, {studySeq, confirmedBy}: UpdateStudyStatus) {
        // const result = {
        //     analysis_date: null,
        //     confirm_user_id: "",
        //     confirmed_by: "",
        //     patient: {
        //         creation_timestamp: null,
        //         patient_age: "",
        //         patient_id: "DKUS001122",
        //         patient_name: null,
        //         patient_sex: null,
        //         seq: 1
        //     },
        //     patient_id: "DKUS001122",
        //     results: null,
        //     seq: 1,
        //     status: "REVIEWED",
        //     study_date: "2018-01-22T00:00:00.000Z",
        //     study_instance_uid: "1.3.7.137.1.339018892107083246134012187371407534024259833",
        //     volumes: 7
        // }
        // const state = getState();
        // const studyList = [...state.allStudies];
        // const studyIndex = studyList.findIndex(item => item.seq === studySeq);
        // studyList[studyIndex] = result;
        // studyList[studyIndex].status = 'Reviewed';
        // setState({
        //     ...state,
        //     confirmUser: confirmedBy,
        //     allStudies: studyList
        // });
        // console.log(getState().allStudies)
        return this.studyTableService.updateStudyStatus({status: 'REVIEWED'}, studySeq).pipe(
            tap((result) => {
                const state = getState();
                const studyList = [...state.allStudies];
                const studyIndex = studyList.findIndex(item => item.seq === studySeq);
                console.log(studyList[studyIndex]);
                studyList[studyIndex] = result;
                studyList[studyIndex].status = 'Reviewed';
                console.log(result);
                setState({
                    ...state,
                    confirmUser: confirmedBy,
                    allStudies: studyList
                });
                console.log(getState().allStudies);
            })
        );
    }

    @Action(GetStudyList)
    // tslint:disable-next-line: typedef
    getStudyList({getState, setState}: StateContext<StudyStateModel>, filter){
        console.log('limit in study state', filter.limit);
        return this.studyTableService.getStudyList(filter.filterStatus, filter.limit, filter.skip).pipe(
            tap((res: StudyRow[]) => {
                console.log(res);
                from(res).pipe(
                    map(val => val.status = val.status[0] + val.status.slice(1).toLowerCase()),
                ).subscribe();
                const state = getState();
                setState({
                    ...state,
                    allStudies: res
                });
            })
        );
    }
}
