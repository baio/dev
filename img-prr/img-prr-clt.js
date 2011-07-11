(function() {
  (function(d,l){function w(){}function Q(a){p=[a]}function g(a,h,i){return a&&a.apply(h.context||h,i)}function x(a){function h(b){!j++&&l(function(){m();n&&(q[c]={s:[b]});y&&(b=y.apply(a,[b]));g(a.success,a,[b,z]);g(A,a,[a,z])},0)}function i(b){!j++&&l(function(){m();n&&b!=B&&(q[c]=b);g(a.error,a,[a,b]);g(A,a,[a,b])},0)}a=d.extend({},C,a);var A=a.complete,y=a.dataFilter,D=a.callbackParameter,E=a.callback,R=a.cache,n=a.pageCache,F=a.charset,c=a.url,e=a.data,G=a.timeout,o,j=0,m=w;a.abort=function(){!j++&&
m()};if(g(a.beforeSend,a,[a])===false||j)return a;c=c||r;e=e?typeof e=="string"?e:d.param(e,a.traditional):r;c+=e?(/\?/.test(c)?"&":"?")+e:r;D&&(c+=(/\?/.test(c)?"&":"?")+encodeURIComponent(D)+"=?");!R&&!n&&(c+=(/\?/.test(c)?"&":"?")+"_"+(new Date).getTime()+"=");c=c.replace(/=\?(&|$)/,"="+E+"$1");n&&(o=q[c])?o.s?h(o.s[0]):i(o):l(function(b,k,s){if(!j){s=G>0&&l(function(){i(B)},G);m=function(){s&&clearTimeout(s);b[H]=b[t]=b[I]=b[u]=null;f[J](b);k&&f[J](k)};window[E]=Q;b=d(K)[0];b.id=L+S++;if(F)b[T]=
F;var N=function(v){(b[t]||w)();v=p;p=undefined;v?h(v[0]):i(M)};if(O.msie){b.event=t;b.htmlFor=b.id;b[H]=function(){/loaded|complete/.test(b.readyState)&&N()}}else{b[u]=b[I]=N;O.opera?(k=d(K)[0]).text="jQuery('#"+b.id+"')[0]."+u+"()":b[P]=P}b.src=c;f.insertBefore(b,f.firstChild);k&&f.insertBefore(k,f.firstChild)}},0);return a}var P="async",T="charset",r="",M="error",L="_jqjsp",t="onclick",u="on"+M,I="onload",H="onreadystatechange",J="removeChild",K="<script/>",z="success",B="timeout",O=d.browser,
f=d("head")[0]||document.documentElement,q={},S=0,p,C={callback:L,url:location.href};x.setup=function(a){d.extend(C,a)};d.jsonp=x})(jQuery,setTimeout);;
  /*

  
  */  var ImageProcessorPresenter;
  ImageProcessorPresenter = (function() {
    var settings;
    settings = null;
    function ImageProcessorPresenter(settings) {
      this.settings = settings;
      if (settings.autoLoad) {
        this.load();
      }
    }
    ImageProcessorPresenter.dataHash = new Array();
    ImageProcessorPresenter.data = function(t, value) {
      if (value) {
        this.dataHash[t.id] = value;
      }
      return this.dataHash[t.id];
    };
    ImageProcessorPresenter.removeData = function(t) {
      return this.dataHash[t.id] = null;
    };
    ImageProcessorPresenter.prototype.load = function() {
      var is_secure, regex_url_test, s, server_url;
      regex_url_test = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      s = this.settings;
      if (s.src) {
        is_secure = location.protocol === "https:";
        server_url = "";
        if (s.server && regex_url_test.test(s.server) && s.server.indexOf('https:') && (is_secure || s.src.indexOf('https:'))) {
          server_url = s.server;
        }
        return $.jsonp({
          url: server_url,
          data: {
            url: s.src,
            process: s.process
          },
          dataType: 'jsonp',
          timeout: 10000,
          success: function(data, status) {
            return $(s.img).load(function() {
              var himg, img, newImg;
              this.width = data.width;
              this.height = data.height;
              img = this;
              if (s.animateCss) {
                newImg = new Image();
                $(newImg).attr({
                  src: img.src,
                  width: img.width,
                  height: img.height
                });
                $(this).after(newImg);
                img = newImg;
              }
              $(this).show();
              if ($.isFunction(s.success)) {
                himg = s.success(img);
                if (himg != null) {
                  img = himg;
                }
                if (img) {
                  if (s.animateCss) {
                    $(img).position({
                      of: $(this),
                      at: "left top",
                      my: "left top"
                    });
                    setInterval(function() {
                      return $(img).addClass(s.animateCss);
                    }, 1);
                  }
                }
                return ImageProcessorPresenter.data(this).animateImg = img;
              }
            }).attr('src', data.data);
          },
          error: function(xhr, text_status) {
            if ($.isFunction(s.error)) {
              return s.error(xhr, text_status);
            }
          }
        });
      } else {
        if ($.isFunction(this.settings.error)) {
          return this.settings.error(null, "src must be defined");
        }
      }
    };
    return ImageProcessorPresenter;
  })();
  $.fn.extend({
    imageProcessor: function(method) {
      var methods, settings;
      settings = {
        src: null,
        server: null,
        process: null,
        img: null,
        autoLoad: true,
        showOnLoad: true,
        animateCss: null,
        success: null,
        error: null
      };
      methods = {
        init: function(options) {
          if (options) {
            $.extend(settings, options);
          }
          return this.each(function() {
            var $t, attr, data, orig, s;
            s = $.extend({}, settings);
            $t = $(this);
            orig = $(this).clone()[0];
            /*
                                id : @id
                                name : @name
                                width : @width
                                height : @height
                                src : @src
                                alt : @alt
                                style : @style
                            */
            attr = $t.attr("data-img-prr-server");
            if (attr) {
              s.server = attr;
            }
            if (!s.server) {
              throw "ImageProcessor.server attribute must be defined!";
            }
            if (s.server.indexOf("?callback=") === -1) {
              s.server = "" + s.server + "?callback=?";
            }
            attr = $t.attr("src");
            if (attr) {
              s.src = attr;
            }
            if (!s.src) {
              throw "ImageProcessor.src attribute must be defined!";
            }
            attr = $t.attr("data-img-prr-process");
            if (attr) {
              s.process = attr;
            }
            attr = $t.attr("data-img-prr-auto-load");
            if (attr) {
              s.autoLoad = new Boolean(attr);
            }
            s.img = this;
            attr = $t.attr("data-img-prr-show-on-load");
            if (attr) {
              s.showOnLoad = new Boolean(attr);
            }
            if (s.showOnLoad) {
              $(s.img).hide();
            }
            data = ImageProcessorPresenter.data(this);
            if (!data) {
              return ImageProcessorPresenter.data(this, {
                orig: orig,
                prr: new ImageProcessorPresenter(s)
              });
            }
          });
        },
        destroy: function() {
          return this.each(function() {
            var data;
            data = ImageProcessorPresenter.data(this);
            if (data) {
              if (data.animateImg) {
                $(data.animateImg).remove();
              }
              $(this).replaceWith(data.orig);
              return ImageProcessorPresenter.removeData(this);
            }
          });
        }
      };
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        return $.error("Method " + method + " does not exist on jQuery.ImageProcessor");
      }
    }
  });
}).call(this);
