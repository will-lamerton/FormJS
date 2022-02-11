const Library={name:"FormJS",version:"1.0.11"},RootOptionsStructure={requiredOptions(a=null){return[{option:"ref",acceptedTypes:["string"]},{option:"el",acceptedTypes:["string"],optional:!0},{option:"form",acceptedTypes:["object","string"],requiredOptions(a=null){return"string"===a?[]:[{option:"id",acceptedTypes:["string"]},{option:"elements",acceptedTypes:["object"]}]}},{option:"onsubmit",acceptedTypes:["object","Function"],requiredOptions(a=null){return[{option:"method",acceptedTypes:["string"]},{option:"url",acceptedTypes:["string"]},{option:"includeFormData",acceptedTypes:["boolean"],optional:!0},{option:"before",acceptedTypes:["function","Function"],optional:!0},{option:"success",acceptedTypes:["function","Function"],optional:!0},{option:"error",acceptedTypes:["function","Function"],optional:!0}]}},{option:"created",acceptedTypes:["function","Function"],optional:!0},{option:"beforeMount",acceptedTypes:["function","Function"],optional:!0},{option:"mounted",acceptedTypes:["function","Function"],optional:!0}]}},ElementOptionsStructure={requiredOptions(a=null){return[{option:"el",acceptedTypes:["string"]},{option:"validate",acceptedTypes:["string"],optional:!0},{option:"attributes",acceptedTypes:["object"],requiredOptions(a=null){return[{option:"id",acceptedTypes:["string"]}]}}]}},Options={test(a,b){this.testExistsAndTypes(a,RootOptionsStructure.requiredOptions()),void 0!==a.ref&&this.testIsUniqueInInstances("ref",b,a.ref),void 0!==a.el&&this.testIsUniqueInInstances("el",b,a.el),"string"==typeof a.form?this.testIsUniqueInInstances("form",b,a.form):0<a.form.elements.length&&a.form.elements.forEach(a=>{this.testExistsAndTypes(a,ElementOptionsStructure.requiredOptions())})},testIsUniqueInInstances(a,b,c){if(0<b.filter(b=>b[a]===c).length)throw`${Library.name} instance with \`${a}\`, \`${c}\` is already in use.`},testExistsAndTypes(a,b,c=null){a=null===c?a:a[c],b.forEach(b=>{if(!a.hasOwnProperty(b.option)&&void 0===b.optional)throw`Option \`${b.option}\` in context \`${JSON.stringify(a)}\` required to create new ${Library.name} instance.`;let c=!1;if(b.acceptedTypes.some(d=>{if(typeof a[b.option]===d||!a.hasOwnProperty(b.option))return c=!0,c}),!1==c)throw`Option \`${b.option}\` in context \`${JSON.stringify(a)}\` requires type(s) \`${b.acceptedTypes}\`. Type \`${typeof a[b.option]}\` received.`;b.hasOwnProperty("requiredOptions")&&this.testExistsAndTypes(a,b.requiredOptions(typeof a[b.option]),b.option)})}};class Validator{form;formData;validationsToMake=[];constructor(a=null,b=null){this.form=a,this.formData=b,null!==this.form&&"string"!=typeof this.form&&this.sortValidations(this.form)}async test(a=null){null!==a&&this.validationsToMake.push({element:a.el,criteria:a.rules});let b={passed:!0,failed:""};validationLayer:for(const a of this.validationsToMake){const c=a.criteria.split("|");for(const d of c)if(d.includes("minLength:")?b=this.testMinLength(a.element,d):d.includes("maxLength:")?b=this.testMaxLength(a.element,d):d.includes("isEmail")?b=this.testIsEmail(a.element):d.includes("isNotDisposableEmail")?await this.testIsDisposableEmail(a.element).then(a=>b=a):d.includes("hasNumber")?b=this.testHasNumber(a.element):d.includes("hasSymbol")?b=this.testHasSymbol(a.element):d.includes("hasCapital")?b=this.testHasCapital(a.element):d.includes("required")?b=this.testRequired(a.element):b={passed:!1,failed:`Validation rule \`${d}\` not recognised`},!1===b.passed)break validationLayer}return!0===b.passed?Promise.resolve(b):Promise.reject(b)}sortValidations(a){a.elements.forEach(a=>{if(a.hasOwnProperty("validate"))return this.validationsToMake.push({element:a.attributes.id,criteria:a.validate}),void(a.hasOwnProperty("elements")&&this.sortValidations(a))})}testMinLength(a,b){const c=parseInt(b.split(":")[1]);return document.getElementById(a).value.length<c?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must be at least ${c} characters!`}:{passed:!0,failed:""}}testMaxLength(a,b){const c=parseInt(b.split(":")[1]);return document.getElementById(a).value.length>c?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must be no more than ${c} characters!`}:{passed:!0,failed:""}}testIsEmail(a){const b=document.getElementById(a).value;return!1===/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(b)?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must be a valid email!`}:{passed:!0,failed:""}}async testIsDisposableEmail(a){const b=document.getElementById(a).value.split("@")[1],c=await fetch(`https://open.kickbox.com/v1/disposable/${b}`).then(a=>a.json()).then(b=>!0===b.disposable?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must not be a disposable email!`}:{passed:!0,failed:""});return Promise.resolve(c)}testHasNumber(a){const b=document.getElementById(a).value;return!1===/\d/.test(b)?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must contain a number!`}:{passed:!0,failed:""}}testHasSymbol(a){const b=document.getElementById(a).value;return!1===/[!@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(b)?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must contain a symbol!`}:{passed:!0,failed:""}}testHasCapital(a){const b=document.getElementById(a).value;return!1===/[A-Z]/.test(b)?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} must contain a capital letter!`}:{passed:!0,failed:""}}testRequired(a){const b=document.getElementById(a).value;return 0>=b.length?{passed:!1,failed:`${a.charAt(0).toUpperCase()+a.slice(1)} is required and can't be submitted empty!`}:{passed:!0,failed:""}}}class Form{fetchApiParams={};form;onsubmit;wrappingEl;constructor(a,b,c){this.form=a,this.onsubmit=b,this.wrappingEl=c}create(){return new Promise((a,b)=>{if("string"==typeof this.form)return b();const c=document.createElement("form");return c.setAttribute("id",this.form.id),document.getElementById(this.wrappingEl).appendChild(c),a()})}createInternalElements(a){return new Promise((b,c)=>"string"==typeof this.form?c():(this.form.elements.forEach(b=>{const c=b.el,d=document.createElement(c);if(b.hasOwnProperty("text")&&(d.innerHTML=b.text),b.hasOwnProperty("attributes"))for(const[a,c]of Object.entries(b.attributes))d.setAttribute(a,c);document.getElementById(a).appendChild(d),b.hasOwnProperty("elements")&&this.createInternalElements(b.attributes.id)}),b()))}bind(){return new Promise(a=>{document.getElementById("string"==typeof this.form?this.form:this.form.id).addEventListener("submit",a=>this.submit(a));const b=["method","url","body","before","success","error"];return Object.entries(this.onsubmit).forEach(([a,c])=>{let d=!1;b.forEach(b=>{if(b==a)return void(d=!0)}),!1==d&&(this.fetchApiParams[a]=c)}),a()})}submit(a){a.preventDefault(),void 0!==this.onsubmit.before&&this.onsubmit.before();const b=!0===this.onsubmit.includeFormData||void 0===this.onsubmit.includeFormData?Object.fromEntries(new FormData(a.target).entries()):{};this.validate(b).then(()=>{fetch(this.onsubmit.url,{method:this.onsubmit.method,body:JSON.stringify(b),...this.fetchApiParams}).then(a=>{if(!1===a.ok)throw a;void 0!==this.onsubmit.success&&this.onsubmit.success(a)}).catch(a=>{void 0!==this.onsubmit.error&&this.onsubmit.error(a,"request/response")})})}validate(a){return new Promise(async(b,c)=>"string"==typeof this.form?b():await new Validator(this.form,a).test().then(()=>b()).catch(a=>(void 0!==this.onsubmit.error()&&this.onsubmit.error(a.failed,"validator"),c(a.failed))))}}class Instance{ref;el;form;onsubmit;created;beforeMount;mounted;getAllElements=()=>"object"==typeof this.form?[...document.getElementById(this.form.id).children]:[...document.getElementById(this.form).children];unmount=()=>document.getElementById(this.form.id).remove();constructor(a,b,c,d,e,f,g){this.ref=a,this.el=b,this.form=c,this.onsubmit=d,this.created=e,this.beforeMount=f,this.mounted=g,void 0!==this.created&&this.created()}mount(){const a=new Form(this.form,this.onsubmit,this.el);void 0!==this.beforeMount&&this.beforeMount(),"object"==typeof this.form?a.create().then(()=>{a.createInternalElements(this.form.id).then(()=>{a.bind().then(()=>{void 0!==this.mounted&&this.mounted()})})}):a.bind().then(()=>{void 0!==this.mounted&&this.mounted()})}destroy(){this.unmount(),window.__FORMJS__.instances=window.__FORMJS__.instances.filter(a=>a!==this)}getInputValue(a){if("object"!=typeof this.form)throw window.__FORMJS__.error(`Trying to get input value of an element that doesn't exist on the instance \`${this.ref}\`.`);const b=this.form.elements.filter(b=>b.attributes.id===a);if(0===b.length)throw window.__FORMJS__.error(`Trying to get input value of an element that doesn't exist on the instance \`${this.ref}\`.`);return document.getElementById(a).value}}class FormJS{options;instances=[];validate=(a,b)=>new Validator().test({el:a,rules:b});version=()=>Library.version;getInstances=()=>[...this.instances];error=a=>console.error(`[${Library.name.toUpperCase()} ERROR] ${a}`);constructor(){window.__FORMJS__=this}create=a=>{try{Options.test(a,this.instances);const b=new Instance(a.ref,a.el,a.form,a.onsubmit,a.created,a.beforeMount,a.mounted);return this.options=a,this.instances.push(b),b}catch(a){return this.error(a),{mount(){window.__FORMJS__.error("You can't mount an instance which failed to create.")}}}}}export{FormJS};
//# sourceMappingURL=formJS.mjs.map
