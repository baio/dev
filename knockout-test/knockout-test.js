(function() {
  /*ko initialization
      Tricks:
      Don't use coffee classes for models objects, if so - class will be generated
      in some kind of static class. Use old school functions to emulate classes.

  */  var processVM, viewModel;
  processVM = function(name) {
    this.name = name;
    this.checked = ko.observable(false);
    this.params = ko.observable(null);
    return null;
  };
  viewModel = {
    cltProcesses: ko.observableArray([new processVM("one"), new processVM("two")])
  };
  ko.applyBindings(viewModel);
}).call(this);