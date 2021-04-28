export class AddSeriesImg {
    static readonly type = '[Series] Add Image Url';
    constructor(public imgUrl: string) {}
}

export class GetSeriesImg {
    static readonly type = '[Series] Get Image Url';
    // constructor(public imgUrl: string) {}
}

export class SetSeriesInfo {
    static readonly type = '[Series] Set Image Url';
    constructor(public studySeq: number, public studyStatus:string) {}
}

export class isStudySelected {
    static readonly type = '[Study] isSelected';
}

export class UpdateStudyData {
    static readonly type = '[Study] Set Study Data';
    constructor(public studySeq: number) {}
}

export class getStudyList {
    static readonly type = '[Study] Get Study Data';
}