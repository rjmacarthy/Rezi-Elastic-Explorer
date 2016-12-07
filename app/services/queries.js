const getDsl = () => {
    if (sessionStorage.getItem('ES-DSL-QUERY')) {
        return JSON.parse(sessionStorage.getItem('ES-DSL-QUERY'));
    } else {
        return {
            'size': 10,
            'from': 0
        };
    }
}

const standardQueries = () => {
    return [{
        name: 'size-from',
        data: {
            'size': 10,
            'from': 0
        }
    }, {
        name: 'bool-query-term',
        data: {
            "size": 10,
            "from": 0,
            "query": {
                "bool": {
                    "must": {
                        "term": {
                            "_id": ""
                        }
                    }
                }
            }
        }
    }, {
        name: 'bool-query-terms',
        data: {
            "size": 10,
            "from": 0,
            "query": {
                "bool": {
                    "must": {
                        "terms": {
                            "field": []
                        }
                    }
                }
            }
        }
    }, {
        name: 'filtered-query',
        data: {
            "size": 10,
            "from": 0,
            "query": {
                "filtered": {
                    "query": {
                        "bool": {
                            "must": {
                                "terms": {
                                    "field": []
                                }
                            }
                        }
                    },
                    "filter": {
                        "bool": {
                            "must": {

                            }
                        }
                    }
                }
            }
        }
    }]
}

const removeAlias = (alias, index) => {
    return {
        "actions": [{
            "remove": {
                "index": index,
                "alias": alias
            }
        }]
    }
}

const addAlias = (alias, index) => {
    return {
        "actions": [{
            "add": {
                "index": index,
                "alias": alias
            }
        }]
    }
}

export {
    standardQueries,
    getDsl,
    addAlias,
    removeAlias
}