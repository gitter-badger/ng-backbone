/**
 * Custom exception extending Error
 * @param {string} message
 */
export class Exception extends Error {
  constructor( message: string ) {
    super( message );
    this.name = "NgBackboneError",
    this.message = message;
  }
}
