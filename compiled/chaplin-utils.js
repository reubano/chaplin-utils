// Generated by CoffeeScript 1.6.2
(function() {
  var ChapinUtils, exports,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ChapinUtils = (function() {
    function ChapinUtils(options) {
      this.log = __bind(this.log, this);
      this.makeComparator = __bind(this.makeComparator, this);
      this.smoothScroll = __bind(this.smoothScroll, this);
      this.initGA = __bind(this.initGA, this);
      this.init = __bind(this.init, this);      this.mediator = options.mediator;
      this.site = options.site;
      this.enable = options.enable;
      this.verbosity = options.verbosity;
      this.urls = options.urls;
      this.time = options != null ? options.time : void 0;
      this.localhost = options != null ? options.localhost : void 0;
      this.ua = options != null ? options.ua : void 0;
      this.google = options != null ? options.google : void 0;
    }

    ChapinUtils.prototype.JQUERY_EVENTS = "blur focus focusin focusout load resize scroll unload click dblclick\nmousedown mouseup  mousemove mouseover mouseout mouseenter mouseleave\nchange select submit keydown keypress keyup error";

    ChapinUtils.prototype.init = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

      Minilog.enable().pipe(new Minilog.backends.jQuery({
        url: this.urls.logger,
        interval: this.log_interval
      }));
      this.logger = Minilog(this.site.id);
      this.log_interval = (_ref = (_ref1 = this.time) != null ? _ref1.logger : void 0) != null ? _ref : 5000;
      this.scroll_time = (_ref2 = (_ref3 = this.time) != null ? _ref3.scroll : void 0) != null ? _ref2 : 750;
      this.analytics = (_ref4 = this.google) != null ? _ref4.analytics : void 0;
      return this.google_analytics_id = "" + ((_ref5 = this.analytics) != null ? _ref5.id : void 0) + "-" + ((_ref6 = this.analytics) != null ? _ref6.site_number : void 0);
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

    ChapinUtils.prototype.changeURL = function(pageId, params) {
      var url;

      if (params == null) {
        params = null;
      }
      url = params != null ? "" + pageId + "?" + ($.param(params)) : pageId;
      return Backbone.history.navigate(url, {
        trigger: false
      });
    };

    ChapinUtils.prototype.smoothScroll = function(postion) {
      return $('html, body').animate({
        scrollTop: postion
      }, this.scroll_time, 'linear');
    };

    ChapinUtils.prototype.filterCollection = function(collection, query) {
      var _ref, _ref1;

      if ((query != null ? (_ref = query.filterby) != null ? _ref.key : void 0 : void 0) && (query != null ? (_ref1 = query.filterby) != null ? _ref1.value : void 0 : void 0)) {
        return new Chaplin.Collection(collection.filter(function(model) {
          return model.get(query.filterby.key) === JSON.parse(query.filterby.value);
        }));
      } else {
        return collection;
      }
    };

    ChapinUtils.prototype.makeFilterer = function(filterby, query) {
      return function(model) {
        var filter1, filter2, model_slugs, model_values, _ref, _ref1, _ref2;

        if ((query != null ? (_ref = query.filterby) != null ? _ref.key : void 0 : void 0) && (query != null ? (_ref1 = query.filterby) != null ? _ref1.value : void 0 : void 0)) {
          filter1 = model.get(query.filterby.key) === query.filterby.value;
        } else {
          filter1 = true;
        }
        if ((filterby != null ? filterby.key : void 0) && (filterby != null ? filterby.value : void 0) && (filterby != null ? filterby.token : void 0)) {
          model_values = _.pluck(model.get(filterby.key), filterby.token);
        } else if ((filterby != null ? filterby.key : void 0) && (filterby != null ? filterby.value : void 0)) {
          model_values = model.get(filterby.key);
        } else {
          filter2 = true;
        }
        if ((model_values != null) && _.isArray(model_values)) {
          model_slugs = _(model_values).map(function(value) {
            return s.slugify(value);
          });
          filter2 = (_ref2 = filterby.value, __indexOf.call(model_slugs, _ref2) >= 0);
        } else if (model_values != null) {
          filter2 = filterby.value === s.slugify(model_values);
        }
        return filter1 && filter2;
      };
    };

    ChapinUtils.prototype.makeComparator = function(sortby, orderby) {
      return function(model) {
        return (orderby === 'asc' ? 1 : -1) * model.get(sortby);
      };
    };

    ChapinUtils.prototype.getTags = function(collection, options) {
      var all, attr, cleaned, collected, count, counts, flattened, n, name, orderby, presorted, sortby, sorted, start, token, _ref, _ref1, _ref2;

      if (!(collection.length > 0)) {
        return [];
      }
      options = options != null ? options : {};
      attr = (_ref = options.attr) != null ? _ref : 'k:tags';
      sortby = (_ref1 = options.sortby) != null ? _ref1 : 'count';
      orderby = options.orderby === 'asc' ? 1 : -1;
      token = options.token;
      n = options.n;
      start = (_ref2 = options.start) != null ? _ref2 : 0;
      flattened = _.flatten(collection.pluck(attr));
      all = token ? _.pluck(flattened, token) : flattened;
      counts = _.countBy(all, function(name) {
        return name != null ? name.toLowerCase() : void 0;
      });
      collected = (function() {
        var _results;

        _results = [];
        for (name in counts) {
          count = counts[name];
          _results.push({
            name: name,
            slug: s.slugify(name),
            count: count
          });
        }
        return _results;
      })();
      cleaned = _.reject(collected, function(tag) {
        var _ref3;

        return (_ref3 = tag.name) === '' || _ref3 === 'undefined';
      });
      presorted = _.sortBy(cleaned, 'name');
      sorted = _.sortBy(presorted, function(name) {
        return orderby * name[sortby];
      });
      if (n) {
        return sorted.slice(start, start + n);
      } else {
        return sorted.slice(start);
      }
    };

    ChapinUtils.prototype.checkIDs = function() {
      return $('[id]').each(function() {
        var ids;

        ids = $('[id="' + this.id + '"]');
        if (ids.length > 1 && ids[0] === this) {
          return console.warn("Multiple IDs for #" + this.id);
        }
      });
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
      var data, local_enabled, local_priority, log_local, log_remote, priority, remote_enabled, remote_priority, text, track, tracker_priority, tracking_enabled, url, user_options, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
        _this = this;

      if (level == null) {
        level = 'debug';
      }
      priority = this._getPriority(level);
      url = this.mediator.url;
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
        console.log("" + level + " for " + url);
      } else if (log_local) {
        console.log(message);
      }
      if (log_remote || track) {
        user_options = {
          time: (new Date()).getTime(),
          user: (_ref1 = (_ref2 = this.mediator) != null ? (_ref3 = _ref2.user) != null ? _ref3.get('email') : void 0 : void 0) != null ? _ref1 : (_ref4 = this.mediator) != null ? (_ref5 = _ref4.user) != null ? _ref5.email : void 0 : void 0
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
        return ga(function(tracker) {
          var hit_options, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref6, _ref7, _ref8, _ref9;

          hit_options = {
            v: 1,
            tid: _this.google_analytics_id,
            cid: tracker.get('clientId'),
            uid: (_ref6 = (_ref7 = _this.mediator) != null ? (_ref8 = _ref7.user) != null ? _ref8.get('id') : void 0 : void 0) != null ? _ref6 : (_ref9 = _this.mediator) != null ? (_ref10 = _ref9.user) != null ? _ref10.id : void 0 : void 0,
            dr: document.referrer || 'direct',
            ua: _this.ua,
            gclid: (_ref11 = _this.google) != null ? _ref11.adwords_id : void 0,
            dclid: (_ref12 = _this.google) != null ? _ref12.displayads_id : void 0,
            sr: "" + screen.width + "x" + screen.height,
            vp: "" + ($(window).width()) + "x" + ($(window).height()),
            t: level,
            an: _this.site.title,
            aid: _this.site.id,
            av: _this.site.version,
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
                el: (_ref13 = options != null ? options.label : void 0) != null ? _ref13 : 'N/A'
              });
              break;
            case 'transaction':
              hit_options = _.extend(hit_options, {
                ti: options.trxn_id,
                tr: (_ref14 = options != null ? options.amount : void 0) != null ? _ref14 : 0,
                ts: (_ref15 = options != null ? options.shipping : void 0) != null ? _ref15 : 0,
                tt: (_ref16 = options != null ? options.tax : void 0) != null ? _ref16 : 0,
                cu: (_ref17 = options != null ? options.cur : void 0) != null ? _ref17 : 'USD',
                ta: (_ref18 = options != null ? options.affiliation : void 0) != null ? _ref18 : 'N/A'
              });
              break;
            case 'item':
              hit_options = _.extend(hit_options, {
                ti: options.trxn_id,
                "in": options.name,
                ip: (_ref19 = options != null ? options.amount : void 0) != null ? _ref19 : 0,
                iq: (_ref20 = options != null ? options.qty : void 0) != null ? _ref20 : 1,
                cu: (_ref21 = options != null ? options.cur : void 0) != null ? _ref21 : 'USD',
                ic: (_ref22 = options != null ? options.sku : void 0) != null ? _ref22 : 'N/A',
                iv: (_ref23 = options != null ? options.category : void 0) != null ? _ref23 : 'N/A'
              });
              break;
            case 'social':
              hit_options = _.extend(hit_options, {
                sn: (_ref24 = options != null ? options.network : void 0) != null ? _ref24 : 'facebook',
                sa: (_ref25 = options != null ? options.action : void 0) != null ? _ref25 : 'like',
                st: (_ref26 = options != null ? options.target : void 0) != null ? _ref26 : url
              });
          }
          if (level === 'experiment') {
            hit_options = _.extend(hit_options, {
              xid: options.xid,
              xvar: (_ref27 = options != null ? options.xvar : void 0) != null ? _ref27 : 'A'
            });
          }
          data = _.extend(options, user_options, hit_options);
          return $.post(_this.urls.tracker, data);
        });
      }
    };

    return ChapinUtils;

  })();

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    exports = module.exports = ChapinUtils;
  } else if (exports != null) {
    exports.ChapinUtils = ChapinUtils;
  } else if ((typeof define !== "undefined" && define !== null ? define.amd : void 0) != null) {
    define([], function() {
      return ChapinUtils;
    });
    this.ChapinUtils = ChapinUtils;
  } else if ((typeof window !== "undefined" && window !== null) || (typeof require !== "undefined" && require !== null)) {
    window.ChapinUtils = ChapinUtils;
  } else {
    this.ChapinUtils = ChapinUtils;
  }

}).call(this);
