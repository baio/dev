
###ko initialization
    Tricks:
    Don't use coffee classes for models objects, if so - generated class
    will be considered knockout as some kind of static object.
    Use old school functions to emulate classes.

###

processVM = (name) ->
    @name = name
    @checked = ko.observable false
    @params = ko.observable null
    #you must return null here instead row above will be returned and knockout initialization silently fails
    null

viewModel = cltProcesses : ko.observableArray [new processVM("one"),  new processVM("two")]

ko.applyBindings viewModel

