/**
 * Dados passados para o componente
 */
interface ComponentMetadata {
  selector?: string;
}

/**
 * [Component description]
 * @param {ComponentMetadata} metadata [description]
 */
function Component(metadata: ComponentMetadata){
  return function(ctor: Function){

  }  
}

@Component({
  selector: 'app-root'
})
export class AppComponent {

}

document.addEventListener("DOMContentLoaded", ()=>{
  console.log("oi");
});