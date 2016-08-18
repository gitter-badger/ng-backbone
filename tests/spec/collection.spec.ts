import { Collection } from "../../src/core";
import { MockFetch } from "../utils";


class TestCollection extends Collection {
  url= "./mock";
}

export default function UtilsSpec(){
  describe("Collection", function(){

    describe("#fetch", function(){

      it( "returns a resolvable Promise", function( done ) {
        let mock = new MockFetch({ foo: "foo" });
        let col = new TestCollection();
        col.fetch().then(( collection: Collection ) => {
          let model = collection.shift();
          expect( model.get( "foo" ) ).toBe( "foo" );
          mock.restore();
          done();
        });
      });

      it( "does not fall on rejection", function( done ) {
        let mock = new MockFetch({ foo: "foo" }, new Error( "Read error" ) );
        let col = new TestCollection();
        col.fetch()
          .catch(( err: Error ) => {
            expect( err.message.length > 0 ).toBe( true );
            mock.restore();
            done();
          });
      });

    });

    describe("#create", function(){
      it( "returns a resolvable Promise", function( done ) {
        let mock = new MockFetch();
        let col = new TestCollection();
        col.create({ foo: "bar" }).then(( model: Backbone.Model ) => {
          expect( model.get( "foo" ) ).toBe( "bar" );
          mock.restore();
          done();
        });
      });

    });

  });
}
