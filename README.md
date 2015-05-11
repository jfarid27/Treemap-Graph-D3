# Treemap-Graph-D3

A treemap based graph layout visualization using D3 based off of the method presented by Chris Muelder and Kwan-Liu Ma.

[Link to original paper](http://www.cs.ucdavis.edu/~ma/papers/EuroVis06_YueWang.pdf))

## Basic Usage

This module is written using the NodeJS module specification and will require module.exports 
as a globally defined variable to be used. See index.html for an example of using it in a browser setting.

*Example*
```javascript

var graph = {'nodes': [...], edges: [...]}

var svg = d3.select('#mySvg')

var treemapper = treemapGraph(d3)

treemapper(graph, svg)

```

##Instantiation

treemapGraph(d3)

Returns treemapper function.
Arguments: d3

##Running

treemapper(graph, d3Selection)

Applies hierarchical clustering to graph and attaches treemap to d3Selection. Returns nothing.


Arguments: Graph, [D3 Selection](https://github.com/mbostock/d3/wiki/Selections)

## Updating Default Parameters

####treemapper.<b>settings.x</b>(parameters)

Used to update margin and width of visualization. Returns treemapper for method chaining.


Arguments: Object with 'margin' and 'width' properties.


####treemapper.<b>settings.y</b>(parameters)

Used to update margin and width of visualization. Returns treemapper for method chaining.


Arguments: Object with 'margin' and 'width' properties.

####treemapper.<b>mode</b>(mode)

Used to update [treemap mode](https://github.com/mbostock/d3/wiki/Treemap-Layout#mode). Returns treemapper for method chaining.


Arguments: String

####treemapper.<b>colorEdgeByGroup</b>(bool)

 
If given nodes in graph have a 'group' property, and mode is set to true, this will color edges between nodes of similar group with the same color. Returns treemapper for method chaining.


Arguments: Boolean

####treemapper.<b>linkageStrategy</b>(function)

Replaces default complete linkage strategy of hierarchical clustering algorithm. Returns treemapper for method chaining.


Arguments: Function

####treemapper.<b>edgeComparator</b>(function)

Replaces default edge comparator of hierarchical clustering algorithm. This function should define edges as a partially ordered set and will define "greatest" edge. Returns treemapper for method chaining.


Arguments: Function

##Basic Type Manifest

```Haskell

type Node :: Id {, Group }
type Nodes :: Null | [Node]
type Id :: Number
type Group :: Number

type Edge :: Source, Target, Value
type Edges :: Null | [Edge]
type Source :: Number
type Target :: Number
type Value :: Number

type Graph :: Edges, Nodes

type LinkageStrategy :: Number, Number -> Number
type EdgeComparator :: Edge, Edge -> Boolean  
```



