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
    constructor(public studySeq: number) {}
}

export class isStudySelected {
    static readonly type = '[Study] isSelected';
}