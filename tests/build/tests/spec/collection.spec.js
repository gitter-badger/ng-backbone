"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../src/core");
var utils_1 = require("../utils");
var TestCollection = (function (_super) {
    __extends(TestCollection, _super);
    function TestCollection() {
        _super.apply(this, arguments);
        this.url = "./mock";
    }
    return TestCollection;
}(core_1.Collection));
function UtilsSpec() {
    describe("Collection", function () {
        describe("#fetch", function () {
            it("returns a resolvable Promise", function (done) {
                var mock = new utils_1.MockFetch({ foo: "foo" });
                var col = new TestCollection();
                col.fetch().then(function (collection) {
                    var model = collection.shift();
                    expect(model.get("foo")).toBe("foo");
                    mock.restore();
                    done();
                });
            });
            it("does not fall on rejection", function (done) {
                var mock = new utils_1.MockFetch({ foo: "foo" }, new Error("Read error"));
                var col = new TestCollection();
                col.fetch()
                    .catch(function (err) {
                    expect(err.message.length > 0).toBe(true);
                    mock.restore();
                    done();
                });
            });
        });
        describe("#create", function () {
            it("returns a resolvable Promise", function (done) {
                var mock = new utils_1.MockFetch();
                var col = new TestCollection();
                col.create({ foo: "bar" }).then(function (model) {
                    expect(model.get("foo")).toBe("bar");
                    mock.restore();
                    done();
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
