require.config({

  // libraries: jquery, bootstrap, font-awesome, lodash, backbone, mustache
  paths: {
    'jquery': '../jquery/jquery',
    'jquery-ui': '../jquery-ui/ui/jquery-ui',
    'bootstrap': '../bootstrap/dist/js/bootstrap',
    'underscore': '../underscore/underscore',
    'Backbone': '../backbone/backbone',
    'Handlebars': '../handlebars/handlebars'
  },

  shim: {
    'underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'Handlebars': {
      exports: 'Handlebars'
    }
  },

  deps: [
    // use global scope
    'jquery', 'jquery-ui', 'underscore', 'Backbone', 'Handlebars'
  ],

  callback: function() {
    require(['board']);
  }
});
