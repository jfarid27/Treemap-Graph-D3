var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default mergeSimilarEdges', function(){
    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        merger = instance.mergeSimilarEdges()
        instance.linkageStrategy = function(j, k){
            return 'linkageStrategyResponse'   
        }
    })

    describe('when given edges', function(){

        var mockEdges 
        beforeEach(function(){

            mockEdges = {
                '$obsv':{},
                reduce: function(reducer){
                    this.$obsv.reducer = reducer
                }
            }

        })

        it('should return reducer response')
        describe('edge reducer', function(){
            describe('when given a checked edges list and an edge', function(){

                var checkedEdges 
                beforeEach(function(){
                    checkedEdges = {
                        '$obsv': {'filterer': []},
                        'filter': function(filterer){
                            this.$obsv.filterer.push(filterer)
                            return {
                                'value': undefined, 
                                'concat':function(){
                                    return 'concatResponse'
                                }
                                
                            }
                        }
                    }
                })

                it('should return result of nonMatching concat')
                describe('nonMatching filter', function(){
                    it("should return edges that don't match next")
                })
                describe('matching filter', function(){
                    it("should return edges that match next")
                })

                describe('matching edge value', function(){
                    it('should be the result of linkageStrategy')
                })

            })
        })
    })
})
