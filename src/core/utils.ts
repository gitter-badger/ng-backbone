/**
 * Decorator to debounce
 */
export function Debounce( wait: number ): Function {
  return function( target: Object | Function, propKey: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
    const callback = descriptor.value;
    let timer: number = null;
    return <PropertyDescriptor>Object.assign({}, descriptor, {
      value: function(): Promise<any> {
        const args = Array.from( arguments );
        clearTimeout( timer );
        return new Promise(( resolve ) => {
          timer = <any>setTimeout(() => {
            timer = null;
            resolve( callback.apply( this, args ) );
          }, wait );
        });
      }
    });
  };
}

/**
 * Decorator to mixin
 */
export function Mixin( mixin: NgBackbone.DataMap<any> ): Function {
  return function( target: Function ){
    Object.assign( target.prototype, mixin );
  };
}


export function mapFrom( mixin: NgBackbone.DataMap<any> ): Map<string, any> {
  let map = <Map<string, any>>new Map();
  mapAssign( map, mixin );
  return map;
}

export function mapAssign( map: Map<any, any>, mixin: NgBackbone.DataMap<any> = {}) {
  Object.keys( mixin ).forEach(( key ) => {
    map.set( key, mixin[ key ] );
  });
}


