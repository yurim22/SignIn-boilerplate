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
    constructor(public studySeq: number, public studyStatus: string, public confirmedBy: string) {}
}

export class IsStudySelected {
    static readonly type = '[Study] isSelected';
}

export class UpdateStudyStatus {
    static readonly type = '[Study] Set Study Data';
    constructor(public studySeq: number, public confirmedBy: string) {}
}

export class GetStudyList {
    static readonly type = '[Study] Get Study Data';
    constructor(public filterStatus: object, public limit: number, public skip: number) {}
}
