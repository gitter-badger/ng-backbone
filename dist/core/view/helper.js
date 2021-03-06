"use strict";
var ngtemplate_1 = require("../../ngtemplate");
var utils_1 = require("../utils");
var ViewHelper = (function () {
    function ViewHelper() {
    }
    /**
     * Translate { getFoo(), getBar() } into { foo: "value", bar: "value" }
     */
    ViewHelper.getterToScope = function (data) {
        var re = /^get[A-Z]/;
        var key, getters = {};
        for (key in data) {
            if (re.test(key) && typeof data[key] === "function") {
                var prop = key.substr(3);
                prop = prop.substr(0, 1).toLowerCase() + prop.substr(1);
                getters[prop] = data[key]();
            }
        }
        return getters;
    };
    /**
     * Converts { foo: Collection, bar: Collection } into
     * { foo: [{},{}], bar: [{},{}] }
     */
    ViewHelper.collectionsToScope = function (collections) {
        var scope = {};
        collections.forEach(function (collection, key) {
            scope[key] = [];
            collection.forEach(function (model) {
                var data = model.toJSON();
                if (model.id) {
                    data.id = model.id;
                }
                scope[key].push(data);
            });
            var getters = ViewHelper.getterToScope(collection);
            getters && Object.assign(scope[key], getters);
        });
        return scope;
    };
    /**
     * Converts model map into JSON
     */
    ViewHelper.modelsToScope = function (models) {
        var scope = {};
        models.forEach(function (model, key) {
            // "groupName.controlName" -> { groupName: { controlName: val } }
            if (key.indexOf(".") !== -1) {
                var ref = key.split(".");
                scope[ref[0]] = scope[ref[0]] || {};
                scope[ref[0]][ref[1]] = model.toJSON();
                return;
            }
            scope[key] = model.toJSON();
        });
        return scope;
    };
    /**
     * Bind specified models to the template
     */
    ViewHelper.bindModels = function (view) {
        view.models.forEach(function (model) {
            view.stopListening(model);
            view.options.logger && view.trigger("log:listen", "subscribes for `change`", model);
            view.listenTo(model, "change", view.render);
        });
    };
    /**
     * Bind specified collections to the template
     */
    ViewHelper.bindCollections = function (view) {
        view.collections.forEach(function (collection) {
            view.stopListening(collection);
            view.options.logger && view.trigger("log:listen", "subscribes for `change destroy sync sort add`", collection);
            view.listenTo(collection, "change destroy sync sort add", function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                // Slightly debounced for repeating calls like collection.sync/sort
                clearTimeout(view._debounceTimer);
                view._debounceTimer = setTimeout(function () {
                    view._debounceTimer = null;
                    view.render.apply(view, args);
                }, 50);
            });
        });
    };
    /**
     * Subscribe logger handlers from options
     */
    ViewHelper.subscribeLogger = function (view, logger) {
        Object.keys(logger).forEach(function (events) {
            view.listenTo(view, events, logger[events]);
        });
    };
    ViewHelper.resetComponentDto = function (view) {
        view._component = {
            models: {},
            collections: {},
            views: utils_1.mapFrom({}),
            template: null,
            templateUrl: null
        };
    };
    ViewHelper.initializeTemplate = function (view, template) {
        // process Component's payload
        view.template = new ngtemplate_1.NgTemplate(view.el, template, {
            willMount: function () {
                view.trigger("component-will-mount");
                view.componentWillMount();
            },
            didMount: function () {
                view.componentDidMount();
                view.trigger("component-did-mount");
            }
        });
    };
    ViewHelper.asyncInitializeTemplate = function (view, options) {
        var template = view._component.template, templateUrl = view._component.templateUrl;
        // shared template
        if ("template" in options && view.options.template) {
            template = view.options.template;
        }
        if ("templateUrl" in options && view.options.templateUrl) {
            templateUrl = view.options.templateUrl;
        }
        if (!templateUrl) {
            ViewHelper.initializeTemplate(view, template);
            return;
        }
        Backbone.ajax({
            url: templateUrl,
            error: function (err) {
                throw new Error("Cannot reach " + templateUrl);
            },
            success: function (tpl) {
                ViewHelper.initializeTemplate(view, tpl);
                view.render();
            }
        });
    };
    /**
     * collections/models passed in options, take them
     */
    ViewHelper.initializeOptions = function (view, options) {
        // When @Component isn't defined
        if (!("_component" in view)) {
            ViewHelper.resetComponentDto(view);
        }
        ViewHelper.asyncInitializeTemplate(view, view.options);
        view.models = utils_1.mapFrom(view._component.models);
        view.collections = utils_1.mapFrom(view._component.collections);
        view.views = utils_1.mapFrom({});
        if ("collections" in options) {
            utils_1.mapAssign(view.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(view.models, options.models);
        }
        if ("views" in options) {
            utils_1.mapAssign(view._component.views, options.views);
        }
    };
    /**
    * Initialize subview
    */
    ViewHelper.initSubViews = function (view, viewCtorMap) {
        viewCtorMap.forEach(function (Ctor, key) {
            var dto, instance;
            if (typeof Ctor === "function") {
                instance = ViewHelper.createSubView(view, Ctor);
            }
            else {
                dto = Ctor;
                instance = ViewHelper.createSubView(view, dto[0], dto[1]);
            }
            view.views.set(key, instance);
        });
    };
    /**
     * Factory: create a subview
     */
    ViewHelper.createSubView = function (view, ViewCtor, options) {
        if (options === void 0) { options = {}; }
        var el = ViewHelper.findSubViewEl(view, ViewCtor.prototype["el"]);
        return new ViewCtor(Object.assign(options, { el: el, parent: view }));
    };
    /**
     * Find inner el
     */
    ViewHelper.findSubViewEl = function (view, selector) {
        if (typeof selector !== "string") {
            throw new SyntaxError("Invalid options.el type, must be a string");
        }
        return view.el.querySelector(selector);
    };
    return ViewHelper;
}());
exports.ViewHelper = ViewHelper;
