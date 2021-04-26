import { state } from "@angular/animations";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map, tap } from "rxjs/operators";
import { Series } from "src/app/models/series.model";
import { StudyTableService } from "src/app/webviewer-main/study-table/study-table.service";
import { GetSeriesImg, SetSeriesInfo, UpdateStudyData } from "./study.actions";

export interface StudyStateModel {
    selectedSeries: Series;
    hasSelectedStudy: boolean;
    selectedStudyStatus: string;
}

@State<StudyStateModel>({
    name: 'study',
    defaults: {
        selectedSeries: null,
        hasSelectedStudy: false,
        selectedStudyStatus: undefined
    }
})

@Injectable()
export class StudyState {
    constructor(private studyTableService: StudyTableService) {
    }

    @Selector()
    static getSeriesUrl(state: StudyStateModel) {
        return state.selectedSeries.image_url
    }

    @Selector()
    static getStudySeq(state: StudyStateModel) {
        return state.selectedSeries.study_seq
    }
    
    @Selector()
    static selectedStudyStatus(state: StudyStateModel) {
        return state.selectedStudyStatus
    }

    @Action(SetSeriesInfo)
    setSeriesInfo({getState, setState}: StateContext<StudyStateModel>, {studySeq, studyStatus}: SetSeriesInfo){
        console.log('studySeq',studySeq)
        console.log('studyStatus', studyStatus)
        //series 정보 전체가 저장된다.
        // setState(state => {
        //     state.hasSelectedStudy = true
        // })
        return this.studyTableService.getSeriesItem(studySeq).pipe(
            tap((res) => {                                    
                const state = getState();
                setState({
                    ...state,
                    selectedSeries: res,
                    selectedStudyStatus: studyStatus
                })
                // console.log(state);
            })
        )
    }

    @Action(UpdateStudyData)
    udpateStudyData({getState, setState}: StateContext<StudyStateModel>, {studySeq}: UpdateStudyData) {

    }


}