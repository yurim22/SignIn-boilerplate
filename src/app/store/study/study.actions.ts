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
    constructor(public studySeq: number, public studyStatus: string) {}
}

export class IsStudySelected {
    static readonly type = '[Study] isSelected';
}

export class UpdateStudyStatus {
    static readonly type = '[Study] Set Study Data';
    constructor(public studySeq: number) {}
}

export class GetStudyList {
    static readonly type = '[Study] Get Study Data';
}
