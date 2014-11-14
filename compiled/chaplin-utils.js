(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("src/chaplin-utils", function(exports, require, module) {
var ChapinUtils, mediator,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

mediator = Chaplin.mediator;

module.exports = ChapinUtils = (function() {
  function ChapinUtils(options) {
    this.log = __bind(this.log, this);
    this.initGA = __bind(this.initGA, this);
    this.init = __bind(this.init, this);
    var _ref;
    this.site = options.site;
    this.enable = options.enable;
    this.verbosity = options.verbosity;
    this.urls = options.urls;
    this.localhost = options != null ? options.localhost : void 0;
    this.ua = options != null ? options.ua : void 0;
    this.log_interval = (_ref = options != null ? options.log_interval : void 0) != null ? _ref : 5000;
    this.google = options != null ? options.google : void 0;
  }

  ChapinUtils.prototype.JQUERY_EVENTS = "blur focus focusin focusout load resize scroll unload click dblclick\nmousedown mouseup  mousemove mouseover mouseout mouseenter mouseleave\nchange select submit keydown keypress keyup error";

  ChapinUtils.prototype.init = function() {
    var _ref, _ref1, _ref2, _ref3;
    Minilog.enable().pipe(new Minilog.backends.jQuery({
      url: this.urls.logger,
      interval: this.log_interval
    }));
    this.logger = Minilog(this.site.id);
    this.analytics = (_ref = this.google) != null ? _ref.analytics : void 0;
    this.subdomain = (_ref1 = this.site) != null ? _ref1.subdomain : void 0;
    return this.google_analytics_id = "" + ((_ref2 = this.analytics) != null ? _ref2.id : void 0) + "-" + ((_ref3 = this.analytics) != null ? _ref3.site_number : void 0);
  };

  ChapinUtils.prototype.initGA = function() {
    var cookie_domain;
    if (this.localhost) {
      cookie_domain = {
        cookieDomain: 'none'
      };
    } else {
      cookie_domain = 'auto';
    }
    ga('create', this.google_analytics_id, cookie_domain);
    return ga('require', 'displayfeatures');
  };

  ChapinUtils.prototype.changeURL = function(url) {
    return Backbone.history.navigate(url, {
      trigger: false
    });
  };

  ChapinUtils.prototype.smoothScroll = function(postion) {
    return $('html, body').animate({
      scrollTop: postion
    }, devconfig.scroll_time, 'linear');
  };

  ChapinUtils.prototype.toggleOrderby = function() {
    return mediator.setOrderby(mediator.orderby === 'asc' ? 'desc' : 'asc');
  };

  ChapinUtils.prototype.filterFeed = function(feed, page) {
    var _ref, _ref1;
    if ((page != null ? (_ref = page.filterby) != null ? _ref.key : void 0 : void 0) && (page != null ? (_ref1 = page.filterby) != null ? _ref1.value : void 0 : void 0)) {
      return new Chaplin.Collection(feed.filter(function(rfp) {
        return rfp.get(page.filterby.key) === JSON.parse(page.filterby.value);
      }));
    } else {
      return feed;
    }
  };

  ChapinUtils.prototype.makeFilterer = function(filterby, tab, flip) {
    if (flip == null) {
      flip = null;
    }
    return function(model) {
      var filter1, filter2, _ref, _ref1, _ref2;
      if ((tab != null ? (_ref = tab.filterby) != null ? _ref.key : void 0 : void 0) && (tab != null ? (_ref1 = tab.filterby) != null ? _ref1.value : void 0 : void 0)) {
        filter1 = model.get(tab.filterby.key) === tab.filterby.value;
      } else {
        filter1 = true;
      }
      if ((filterby != null ? filterby.key : void 0) && (filterby != null ? filterby.value : void 0) && filterby.key === 'tag') {
        filter2 = (_ref2 = filterby.value, __indexOf.call(model.get('k:tags'), _ref2) >= 0);
      } else if ((filterby != null ? filterby.key : void 0) && (filterby != null ? filterby.value : void 0)) {
        filter2 = model.get(filterby.key) === filterby.value;
      } else {
        filter2 = true;
      }
      return filter1 && filter2;
    };
  };

  ChapinUtils.prototype.makeComparator = function(sortby, orderby) {
    if (sortby == null) {
      sortby = null;
    }
    if (orderby == null) {
      orderby = null;
    }
    sortby = sortby != null ? sortby : mediator.sortby;
    orderby = orderby != null ? orderby : mediator.orderby;
    return function(model) {
      return (orderby === 'asc' ? 1 : -1) * model.get(sortby);
    };
  };

  ChapinUtils.prototype.getTags = function(collection) {
    return _.uniq(_.flatten(collection.pluck('k:tags'))).sort();
  };

  ChapinUtils.prototype._getPriority = function(level) {
    switch (level) {
      case 'debug':
        return 1;
      case 'info':
        return 2;
      case 'warn':
        return 3;
      case 'error':
        return 4;
      case 'pageview':
        return 5;
      case 'screenview':
        return 6;
      case 'event':
        return 7;
      case 'transaction':
        return 8;
      case 'item':
        return 9;
      case 'social':
        return 10;
      default:
        return 0;
    }
  };

  ChapinUtils.prototype.log = function(message, level, options) {
    var data, local_enabled, local_priority, log_local, log_remote, priority, remote_enabled, remote_priority, text, track, tracker_priority, tracking_enabled, url, user_options, _ref, _ref1;
    if (level == null) {
      level = 'debug';
    }
    if (options == null) {
      options = null;
    }
    priority = this._getPriority(level);
    options = options != null ? options : {};
    local_enabled = this.enable.logger.local;
    remote_enabled = this.enable.logger.remote;
    tracking_enabled = ((_ref = this.analytics) != null ? _ref.id : void 0) && this.enable.tracker;
    local_priority = priority >= this.verbosity.logger.local;
    remote_priority = priority >= this.verbosity.logger.remote;
    tracker_priority = priority >= this.verbosity.tracker;
    log_local = local_enabled && local_priority;
    log_remote = remote_enabled && remote_priority;
    track = tracking_enabled && tracker_priority;
    if (log_local && priority >= this.verbosity.tracker) {
      console.log("" + level + " for " + message);
    } else if (log_local) {
      console.log(message);
    }
    if (log_remote || track) {
      user_options = {
        time: (new Date()).getTime(),
        user: mediator != null ? (_ref1 = mediator.user) != null ? _ref1.get('email') : void 0 : void 0
      };
    }
    if (log_remote) {
      text = JSON.stringify(message);
      message = text.length > 512 ? "size exceeded" : message;
      data = _.extend({
        message: message
      }, user_options);
      this.logger[level](data);
    }
    if (track) {
      if ((typeof config !== "undefined" && config !== null ? config.subdomain : void 0) != null) {
        url = "/" + config.subdomain + mediator.url;
      } else {
        url = mediator.url;
      }
      return ga(function(tracker) {
        var hit_options, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        hit_options = {
          v: 1,
          tid: this.google_analytics_id,
          cid: tracker.get('clientId'),
          uid: mediator != null ? (_ref2 = mediator.user) != null ? _ref2.get('id') : void 0 : void 0,
          dr: document.referrer || 'direct',
          ua: this.ua,
          gclid: (_ref3 = this.google) != null ? _ref3.adwords_id : void 0,
          dclid: (_ref4 = this.google) != null ? _ref4.displayads_id : void 0,
          sr: "" + screen.width + "x" + screen.height,
          vp: "" + ($(window).width()) + "x" + ($(window).height()),
          t: level,
          an: this.site.title,
          aid: this.site.id,
          av: this.site.version,
          dp: url,
          dh: document.location.hostname,
          dt: message
        };
        switch (level) {
          case 'event':
            hit_options = _.extend(hit_options, {
              ec: options.category,
              ea: options.action,
              ev: options != null ? options.value : void 0,
              el: (_ref5 = options != null ? options.label : void 0) != null ? _ref5 : 'N/A'
            });
            break;
          case 'transaction':
            hit_options = _.extend(hit_options, {
              ti: options.trxn_id,
              tr: (_ref6 = options != null ? options.amount : void 0) != null ? _ref6 : 0,
              ts: (_ref7 = options != null ? options.shipping : void 0) != null ? _ref7 : 0,
              tt: (_ref8 = options != null ? options.tax : void 0) != null ? _ref8 : 0,
              cu: (_ref9 = options != null ? options.cur : void 0) != null ? _ref9 : 'USD',
              ta: (_ref10 = options != null ? options.affiliation : void 0) != null ? _ref10 : 'N/A'
            });
            break;
          case 'item':
            hit_options = _.extend(hit_options, {
              ti: options.trxn_id,
              "in": options.name,
              ip: (_ref11 = options != null ? options.amount : void 0) != null ? _ref11 : 0,
              iq: (_ref12 = options != null ? options.qty : void 0) != null ? _ref12 : 1,
              cu: (_ref13 = options != null ? options.cur : void 0) != null ? _ref13 : 'USD',
              ic: (_ref14 = options != null ? options.sku : void 0) != null ? _ref14 : 'N/A',
              iv: (_ref15 = options != null ? options.category : void 0) != null ? _ref15 : 'N/A'
            });
            break;
          case 'social':
            hit_options = _.extend(hit_options, {
              sn: (_ref16 = options != null ? options.network : void 0) != null ? _ref16 : 'facebook',
              sa: (_ref17 = options != null ? options.action : void 0) != null ? _ref17 : 'like',
              st: (_ref18 = options != null ? options.target : void 0) != null ? _ref18 : mediator.url
            });
        }
        if (level === 'experiment') {
          hit_options = _.extend(hit_options, {
            xid: options.xid,
            xvar: (_ref19 = options != null ? options.xvar : void 0) != null ? _ref19 : 'A'
          });
        }
        data = _.extend(options, user_options, hit_options);
        return $.post(this.urls.tracker, data);
      });
    }
  };

  return ChapinUtils;

})();
});

;
//# sourceMappingURL=chaplin-utils.js.map