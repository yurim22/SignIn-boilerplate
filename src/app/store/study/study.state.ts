import { state } from "@angular/animations";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map, tap } from "rxjs/operators";
import { Series } from "src/app/models/series.model";
import { StudyTableService } from "src/app/webviewer-main/study-table/study-table.service";
import { GetSeriesImg, SetSeriesInfo } from "./study.actions";

export interface StudyStateModel {
    selectedSeries: Series;
    hasSelectedStudy: boolean;
}

@State<StudyStateModel>({
    name: 'study',
    defaults: {
        selectedSeries: null,
        hasSelectedStudy: false,
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

    // @Action(GetSeriesImg)
    // getSeriesImg({getState, setState}: StateContext<StudyStateModel>, imgUrl: string){
    //     // console.log('seq', seq)
    //     return this.studyTableService.getSeriesItem(seq).pipe(
    //         tap((result) => {
    //             const state = getState();
    //             setState({
    //                 ...state,
    //                 selectedSeries: result               
    //             })
    //         })
    //     )
    //     // return imgUrl
    // }

    @Action(SetSeriesInfo)
    setSeriesInfo({getState, setState}: StateContext<StudyStateModel>, {studySeq}: SetSeriesInfo){
        console.log(studySeq)
        //series 정보 전체가 저장된다.
        // setState(state => {
        //     state.hasSelectedStudy = true
        // })
        return this.studyTableService.getSeriesItem(studySeq).pipe(
            tap((res) => {
                const state = getState();
                setState({
                    ...state,
                    selectedSeries: res
                })
            })
        )
    }

}