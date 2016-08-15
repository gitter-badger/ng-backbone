import { Exception } from "./exception";

export class FormValidators {

  [key: string]: Function;

  email( value: string ): Promise<void> {
    let pattern = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
    if ( pattern.test( value  ) ) {
      return Promise.resolve();
    }
    return Promise.reject( "Please enter a valid email address" );
  }

  tel( value: string ): Promise<void> {
    let pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if ( pattern.test( value  ) ) {
      return Promise.resolve();
    }
    return Promise.reject( "Please enter a valid tel. number +1 11 11 11" );
  }

  url( value: string ): Promise<void> {
    let pattern = new RegExp( "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d\\-]*[a-z\\d])*)\\.)" +
						 "+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[\\-a-z\\d%_.~+]*)" +
						 "*(\\?[;&a-z\\d%_.~+=\\-]*)?(\\#[\\-a-z\\d_]*)?$", "i" );
    if ( pattern.test( value  ) ) {
      return Promise.resolve();
    }
    return Promise.reject( "Please enter a valid URL" );
  }

};


