export interface SyModuleMetadata {
  components: (typeof Function)[];
  bootstrap: (typeof Function)[];
}

function SyModule(metadata: SyModuleMetadata) {
  return (ctor: Function) => {}
}

import { AppComponent } from './app.component';

@SyModule({
  components: [],
  bootstrap: []
})
export class AppModule {

}