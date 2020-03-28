
const TYPE = {
    IMPORTANT_URGENT: 0
    , IMPORTANT_NOT_URGENT: 1
    , NOT_IMPORTANT_URGENT: 2
    , NOT_IMPORTANT_NOT_URGENT: 3
}

export default {
    ...TYPE
    , item: [
        {
            label: '很重要-很紧急'
        }
        , {
            label: '重要-不紧急'
        }
        , {
            label: '不重要-紧急'
        }
        , {
            label: '不重要-不紧急'
        }
    ]
    , status: [
        {
            label: '未完成'
            , value: false
        }
        , {
            label: '已完成'
            , value: true
        }

    ]
    , statusAdd: [
        {
            label: '已完成'
            , value: true
        }

    ]

}
