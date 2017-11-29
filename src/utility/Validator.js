import locale  from '../helpers/locale/en';
import $  from 'jquery';

var validator = {
  rules        : {},
  locale       : {},
  errors       : {},
  params       : {},
  forms          : {},
  currentModule  : false,
  localeLoaded   : false,
  component      : false,
  through        : 'angular',
  asyncErrors    : {},
  angularPromise : false,
  RADIO          : 'radio',
  blurEventListner : function(event){    
    const element = event.target;

    let initValidator = () => {
      var errors  = validator.validateElement(element,null);

      if(validator.component && validator.component.hasOwnProperty('state')){
        errors = validator.getFormattedErrorMessage(errors,validator.component.state.inputErrors ? validator.component.state.inputErrors : {},element);
        validator.component.setState({inputErrors : errors});
      }
    } 

    if(element.dataset.hasOwnProperty('datepicker')){
      setTimeout(initValidator,200);
    } else {
      initValidator();
    }    
  },
  setComponent : function(component){
    this.component = component;

    return this;
  },
  reintializeValidation : function(form,scope,module){    
        if(module && !scope.errors[module]){
          scope.errors[module] = {};
        }  
        
        if(module && module.trim().length > 0){
            validator.setCurrentModule(module).setFormByModule(form);
        }

        form.find('textarea,select,input:not(input[type="hidden"],input[type="submit"],input[type="file"],input[data-ignore-validation])').each(function(){
            $(this).on('blur',function(){
                var element = this;
          
                var initValidator = function(){
                    var errors  = validator.validateElement(element,module);
              
                    if(scope.hasOwnProperty('errors')){
                        if(module && module.trim().length > 0){
                          scope.errors[module] = validator.getFormattedErrorMessage(errors,scope.errors.hasOwnProperty(module) ? scope.errors[module] : {},element);
                        } else {
                          scope.errors = validator.getFormattedErrorMessage(errors,scope.errors,element);
                        }
                        
                        if (!scope.$$phase){
                          scope.$apply()
                        }
                    }                 
                } 
          
                if(element.dataset.hasOwnProperty('datepicker')){
                  setTimeout(initValidator,200);
                } else {
                  initValidator();
                }
            });
        });
  },
  validateReactForm : function(form,module){    
    if(!validator.component || !validator.component.state){
      validator.component = {state : {inputErrors : {}}};
    }    
    if(module && !validator.component.state.inputErrors[module]){
      validator.component.state.inputErrors[module] = {};
    }  
    $(form).find('textarea,select,input:not(input[type="submit"],input[type="file"],input[data-ignore-validation],input[data-unique])').each(function(){
        var validationErrors  = validator.validateElement(this,module);

        if(module){
          Object.assign(
            validator.component.state.inputErrors[module],
            validator.getFormattedErrorMessage(validationErrors,validator.component.state.inputErrors[module],this)
          );                    
        } else {
          Object.assign(validator.component.state.inputErrors,validator.getFormattedErrorMessage(validationErrors,validator.component.state.inputErrors,this));  
        }        
    });    

    validator.component.setState({inputErrors : validator.component.state.inputErrors});

    return Object.keys(typeof module === 'string' ? validator.component.state.inputErrors[module] : validator.component.state.inputErrors).length === 0;
  },
  loadLocale : function(){
    if(typeof locale === 'object' && locale !== null){
      validator.setLocale(locale);
    }
  }, 
  getFormattedErrorMessage : function(validationErrors,errors,element) {
    var index  = element.dataset.hasOwnProperty('index') ? element.dataset.index : false;
    var parent = element.dataset.hasOwnProperty('parent') ? element.dataset.parent : false;
    if(Object.keys(validationErrors).length === 0){
      if (
        index 
        && parent 
        && errors.hasOwnProperty(parent)
        && errors[parent].hasOwnProperty(index)
        && errors[parent][index].hasOwnProperty(element.getAttribute('name'))       
      ){
        delete errors[parent][index][element.getAttribute('name')]; 
        
        if(Object.is({},errors[parent][index])){
            delete errors[parent][index];
        }
        
        if(Object.is({},errors[parent])){
            delete errors[parent];
        }
      } else if (errors.hasOwnProperty(element.getAttribute('name'))){
        delete errors[element.getAttribute('name')];
      }
      return errors;
    }

    Object.keys(validationErrors).forEach((field) => {
      var msg = validationErrors[field];

      if(msg){
        if(index && parent){
          if(!errors.hasOwnProperty(parent)){
            errors[parent] = {};
          }
          
          if(!errors[parent].hasOwnProperty(index)){
              errors[parent][index] = {};
          }
          
          errors[parent][index][field] = {has : true,message : msg};
        } else {
          errors[field] = {has : true,message : msg};
        }
      } else if (errors.hasOwnProperty(element.getAttribute('name'))){
          delete errors[element.getAttribute('name')]; 
      }
    });
    return errors;
  },    
  fillElementErrorMessageUsingJquery : function(element,errors) {
    var eleName = element.getAttribute('name');
    errors  = (typeof errors === 'object') ? errors : this.errors;

    if(errors.hasOwnProperty(eleName) && errors[eleName]) {
      $(element).parent().addClass('has-error').find('.help-block').removeClass('hide').text(errors[eleName]);
    }
  },
  fillMultiCheckErrorMessageUsingJquery : function(element,errors,elementName) {
    errors  = (typeof errors === 'object') ? errors : this.errors;

    if(errors.hasOwnProperty(elementName) && errors[elementName]) {
      $(element).closest('div.form-group').addClass('has-error').find('.help-block').removeClass('hide').text(errors[elementName]);
    }
  },  
  cleanElementErrorMessage : function(element) {
    $(element).parent().removeClass('has-error').find('.help-block').addClass('hide').text('');

      return this;
  },
  cleanMultiCheckElementErrorMessage : function(element) {
      $(element).closest('div.form-group').removeClass('has-error').find('.help-block').addClass('hide').text('');

      return this;
  },     
  reintializeEventValidationByModule : function(module,scope) {
      if(this.forms.hasOwnProperty(module)  && typeof this.forms[module] === 'object'){
          this.forms[module].find('textarea,select,input:not(input[type="hidden"],input[data-datepicker],input[type="submit"],input[type="file"],input[data-ignore-validation])').each(function(){
            $(this).on('blur',function(){
              var errors  = validator.validateElement(this,module);

              if(scope.hasOwnProperty('errors')){
                  scope.errors[module] = validator.getFormattedErrorMessage(errors,scope.errors.hasOwnProperty(module) ? scope.errors[module] : {},this);

                if(!scope.$$phase){
                  scope.$apply()
                }
              }
            });
          });
      }

      return this;
  },    
  validateElement : function(element,module){
    if(!element.hasAttribute('data-ignore-validation')){
      var elementRule = this.getRuleByElement(element,module);

      if(elementRule){
        return this.validate(element,elementRule);
      }
    }

    return {};
  },  
  validate : function(element,elementRule){ 
    var rules = elementRule.split("|");
    if(this.through !== 'jQuery'){
       this.errors = {};
    }
    this.errors = {}; 
    for(var iter = 0; iter < rules.length; iter++){
      var validatorMethod = this.getValidatorName(rules[iter]);   
      this.setParamByRule(rules[iter]);

      if(this.hasOwnProperty(validatorMethod) && !this[validatorMethod](element)){
        if(validatorMethod !== 'validateUnique'){
          this.setErrorMessageForElement(this.getParseRuleName(rules[iter]),element)  
        }
        break;  
      }
    }    
    return this.errors;
  },  
  setRules : function(rules,module){
  if(typeof rules === 'object' && rules !== null && typeof module === 'string'){
    this.rules[module] = rules;
  } else if(typeof rules === 'object' && rules != null){
    this.rules = rules;
  }  else {
    this.rules = {};
  }

    return this;
  },
  setLocale : function(locale){
    this.locale = (typeof locale === 'object') ? locale : {};

    return this;
  },
  setScope : function(scope){
    this.scope = scope;

    return this;
  },  
  setCurrentModule : function(module){
    this.currentModule = module;

    return this;
  },
  setFormByModule : function(form){
    if(this.currentModule){
      this.forms[this.currentModule] = form;
    }

    return this;
  },            
  setAngularPromise : function(promise){
    this.angularPromise = promise;

    return this;
  },
  setTinyMceElementValidation : function(element){
     element.on('blur', function(e) {
       if(typeof element.targetElm === 'object'){
        element.targetElm.innerHTML = element.getContent();
        validator.cleanElementErrorMessage(element.targetElm).validateElement(element.targetElm);
        validator.fillElementErrorMessageUsingJquery(element.targetElm,false);
       }
     });
   },  
  getRuleByElement : function(element,module){
    var eleName = (typeof element === 'string') ? element : element.getAttribute('name');
    var rulesByModule = (typeof module === 'string' && this.rules.hasOwnProperty(module))?  this.rules[module] : this.rules;

    return rulesByModule.hasOwnProperty(eleName) ? rulesByModule[eleName] : false;
  },    
  ucfirst : function(str) {
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
  },
  getErrorMessageByRule : function(rule){
    let message = false;

    try{
      message = (this.locale.hasOwnProperty(rule)) ? this.locale[rule] : false;
    } catch(error){
      return error;
    }

    return message;
  },
  getValidatorName : function(rule) {
      var validatorMethod = 'validate'+this.ucfirst(this.camelCase(rule)); 

      if(validatorMethod.indexOf(':') !== -1){
        validatorMethod = validatorMethod.substr(0,validatorMethod.indexOf(':'));
    }

    return validatorMethod;
  },
  camelCase : function (str) { 
    return str.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
        return (p2) ? p2.toUpperCase() : p1.toLowerCase();        
    });
  },
  getParseRuleName : function(ruleName) {
    if(ruleName.indexOf(':') !== -1){
        ruleName = ruleName.substr(0,ruleName.indexOf(':'));
    }

    return ruleName;
  }, 
  setParamByRule : function(rule) {
    var params   = this.getParamFromRule(rule);
    var ruleName = this.getParseRuleName(rule);

    if(typeof params === 'object' && params.length > 0){
      switch(ruleName){      
        case 'max':
          var maxLength = parseInt(params[0],10);

          if(typeof maxLength === 'number'){
            this.params[ruleName] = maxLength;
          }
        break;
        case 'min':
            var minLength = parseInt(params[0],10);

            if(typeof minLength === 'number'){
              this.params[ruleName] = minLength;
            }
          break;
        case 'required_unless':
        case 'required_if':
          if(params.length > 1){
            this.params[ruleName] = {inputName : params[0],inputValue : params[1]};
          }
        break;
        case 'url':
          this.params[ruleName] = {inputName : params[0]};
        break;
        case 'required_with':
            this.params[ruleName] = {inputName : params[0]};
        break; 
        case 'same':
            this.params[ruleName] = {inputName : params[0]};
        break;    
        case 'different':         
            this.params[ruleName] = {inputName : params[0]};
        break;    
        default:
        break;
      }
    }

    return ruleName;
  },    
  getParamFromRule : function(rule) {
    var params = [];

      if(rule.indexOf(':') !== -1){
        params = rule.substr(rule.indexOf(':') + 1).split(',');
    }

    return params;
  },
  formatName : function(name) {   
    if(name && name.indexOf('_id') !== -1){
        name = name.substr(0,name.indexOf('_id'));
    } else if(name){
        name = this.camelCase(name);
    }

    return name;
  },
  /**
   * get dom element object by name
   * if index is set get the element by id
   *
   * @param string name
   * @param string index
   * @return object
   */
  getElement : function(name,index) {
    if(typeof index !== 'undefined'){
      return document.getElementById(name+'_'+index);
    }

    var elements = document.getElementsByName(name);
    var matchedElement = false;

    if(elements.length > 0){
      /**
       * if the element is radio will return the selected radio element
       */ 
      if(elements[0].getAttribute('type') === this.RADIO){
        for (var i = 0;i < elements.length; i++) {
          if(elements[i].checked){
            matchedElement = elements[i];
            break;
          }
        }
      } else {
        matchedElement = elements[0];
      }
    }

    return matchedElement;
  },      
  setErrorMessageForElement : function(rule,element,params) {
    var eleName      = element.getAttribute('name');
    var eleValidationName      = element.getAttribute('data-validation-name') ? element.getAttribute('data-validation-name') : element.getAttribute('name');
    var displayName  = this.formatName(eleValidationName.replace(/[0-9]/g, ''));
    var message      = this.getErrorMessageByRule(rule);      

    if(element.hasAttribute('data-validation-message')){
      message = element.getAttribute('data-validation-message');
    } else if(message){
      switch(rule){
        case 'max':
          if(typeof message === 'object' && element.getAttribute('type') === "number" && message.hasOwnProperty('numeric') ){
              message = message.numeric.replace(/:attribute/g, this.ucfirst(displayName))
                                      .replace(/:max/g, this.params.hasOwnProperty('max') ? this.params.max : '');
          } else if(typeof message === 'object' && message.hasOwnProperty('string')){    
              message = message.string.replace(/:attribute/g, this.ucfirst(displayName))
                                    .replace(/:max/g, this.params.hasOwnProperty('max') ? this.params.max : '');
          }
        break;
        case 'min':
            if(typeof message === 'object' && message.hasOwnProperty('string')){
              message = message.string.replace(/:attribute/g, this.ucfirst(displayName))
                                      .replace(/:min/g, this.params.hasOwnProperty('min') ? this.params.min : '');
            }
          break;
        case 'required_unless':
            message = message.replace(/:attribute/g, this.ucfirst(displayName))
                             .replace(/:other/g, this.ucfirst(this.formatName(this.params.required_unless.inputName)))
                             .replace(/:value/g, this.params.required_unless.hasOwnProperty('label') 
                              ? this.params.required_unless.label : '');
        break;
        case 'required_if':
            message = message.replace(/:attribute/g, this.ucfirst(displayName))
                             .replace(/:other/g, this.ucfirst(this.formatName(this.params.required_if.inputName)))
                             .replace(/:value/g, this.params.required_if.hasOwnProperty('label') 
                              ? this.params.required_if.label : '');
        break;        
        case 'required_with':
            message = message.replace(/:attribute/g, this.ucfirst(displayName))
                             .replace(/:values/g, this.ucfirst(this.formatName(this.params.required_with.inputName)))
                             .replace(/:value/g, this.params.required_with.hasOwnProperty('label'));
        break;  
        case 'same':
          if(this.params.same.inputName==='userpassword'){
            message = message.replace(/:attribute/g, this.ucfirst(displayName))
                             .replace(/:other/g, this.ucfirst('password'))
                             .replace(/:value/g, this.params.same.hasOwnProperty('label'));
          }else{
            message = message.replace(/:attribute/g, this.ucfirst(displayName))
                     .replace(/:other/g, this.ucfirst(this.formatName(this.params.same.inputName)))
                                 .replace(/:value/g, this.params.same.hasOwnProperty('label'));
          }
        break;    
        case 'different':
          message = message.replace(/:attribute/g, this.ucfirst(displayName))
                     .replace(/and :other/g, '')
                     .replace(/:value/g, this.params.different.hasOwnProperty('label'));
        break;  
        case 'url':
          message = message.replace(/:attribute/g, this.ucfirst(displayName));
        break;
        default:          
          message = message.replace(/:attribute/g, this.ucfirst(displayName));
        break;
      }      
      this.errors[eleName] = message;     
    }

    if(message){
        switch(displayName){
          case 'userpassword': 
            message=message.replace(/Userpassword/g, this.ucfirst(displayName.substring(4)));  
          break           
          default:        
            message = message.replace(/:attribute/g, this.ucfirst(displayName));
          break;
        }      
        this.errors[eleName] = message;     
    }
  },  
  getPromise : function(url) {
    var promise = false;

    if(url){
      switch(this.through){
        case 'jQuery':
          promise = $.ajax({url : url});
        break;
        default:
          promise = this.angularPromise ? this.angularPromise.get(url) : false;
        break;
      }
    }

    return promise;
  },  
  promiseFailHandler : function(response,element) {
      var eleName = element.getAttribute('name');
      this.asyncErrors[eleName] = this.getErrorMessageByRule('unique').replace(/:attribute/g, this.ucfirst(eleName));
      this.fillElementErrorMessageUsingJquery(element,this.asyncErrors);
  },    
  promiseSuccessHandler : function(response,element) {
      var eleName = element.getAttribute('name');

      if(this.asyncErrors.hasOwnProperty(eleName)){
        delete this.asyncErrors[eleName];
      }
  },    
  validateRequired : function(element) {
    return (element.value && element.value.trim().length > 0);
  },
  validateAlpha : function(element) {
    return /^[A-Za-z ]+$/.test(element.value);
  },
  validateEmail : function(element) {
    return (element.value && element.value.trim()) ? /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(element.value) : true ;
  },
  validateNumeric : function(element) {
    return (element.value && element.value.trim()) ? /^-?\d*(\.\d+)?$/.test(element.value) : true ;
  },
  validateMax : function(element) {
    if(this.params.hasOwnProperty('max')){
      
      return (element.getAttribute('type') === "number") ? Number(element.value) <= this.params.max : element.value.trim().length <= this.params.max;
    }

    return true;
  },
  validateMin : function(element) {
  if(this.params.hasOwnProperty('min')){
     return element.value.trim().length >= this.params.min;
  }
  return true;
 },
  validateSame : function(element) {
    if(
      this.params.hasOwnProperty('same') 
      && typeof this.params.same === 'object'
      && this.params.same.hasOwnProperty('inputName')
    ){
     var dependendElement = this.getElement(this.params.same.inputName);
     if(element.value!==dependendElement.value){
       return false;
     }
     }
   return true;
  },
  validateDifferent : function(element) { 
   var dependendElement = this.getElement(this.params.different.inputName); 
   if(element.value===dependendElement.value){
     return false;
   }
   return true;
  },
  validateRegex : function(element) {
    let str=element.value;
    if(str.indexOf(" ") !== -1){
       return false;
    }else if(/^[a-zA-Z0-9]*$/.test(str) === false){
      return false;
    }
    return true;
  },
  validateRequiredIf : function(element) {
  if(
      this.params.hasOwnProperty('required_if') 
      && typeof this.params.required_if === 'object'
      && this.params.required_if.hasOwnProperty('inputName') 
      && this.params.required_if.hasOwnProperty('inputValue') 
    ){
      var dependendElement = this.getElement(this.params.required_if.inputName,element.dataset.hasOwnProperty('index') ? element.dataset.index : false);
      if(
        dependendElement    
        && dependendElement.value === this.params.required_if.inputValue
        && !this.validateRequired(element)
      ){
            if(dependendElement.getAttribute('type') === 'SELECT'){
              /**
               * set the selected value label so we can use it for error message
               */
                this.params.required_if['label'] = dependendElement.options[dependendElement.selectedIndex].innerHTML;
            } else {
                this.params.required_if['label'] = '';
            }
        return false;
      }
    }
    return true;
  },
  validateRequiredUnless : function(element) {
    if(
      this.params.hasOwnProperty('required_unless') 
      && typeof this.params.required_unless === 'object'
      && this.params.required_unless.hasOwnProperty('inputName') 
      && this.params.required_unless.hasOwnProperty('inputValue') 
    ){
      var dependendElement = this.getElement(this.params.required_unless.inputName);
      var dependendValue   = dependendElement && dependendElement.value ? parseInt(dependendElement.value,10) : false;

      if(
        typeof dependendValue === 'number'
        && parseInt(dependendElement.value,10) !== parseInt(this.params.required_unless.inputValue,10)
        && !this.validateRequired(element)
      ){
        /**
         * set the selected value label so we can use it for error message
         */
        this.params.required_unless['label'] = dependendElement.options[dependendElement.selectedIndex].innerHTML;
        return false;
      }
    }

    return true;
  },
  validateRequiredWith : function(element) {
    if(
      this.params.hasOwnProperty('required_with') 
      && typeof this.params.required_with === 'object'
    ){
      var dependendElement = this.getElement(this.params.required_with.inputName,element.dataset.hasOwnProperty('index') ? element.dataset.index : false);

      if(
          dependendElement
          && typeof dependendElement === 'object' 
          && dependendElement.value.trim().length > 0 
          && !this.validateRequired(element)
      ){
        return false;
      }
    }

    return true;
  },
  /**
   * validate user entry is date
   * @see http://jsfiddle.net/EywSP/849/
   */
  validateDate : function(element){
      return (element.value.trim().length > 0) ? this.isDate(element.value.trim()) : true;
  },
  isValidateDateofBirth : function(dob){  
      var isValideDate = true;
      if(this.isDate(dob)){
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if(age <= 18) {           
              isValideDate = false;
        }else{
              isValideDate = true;
        }
      }else{
        isValideDate = false;
      }
           
      return isValideDate;
  },  
  isDate : function(date){
      var isValideDate = true;
      if(date){
        var dateArray = date.match(/^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/);

        if(typeof dateArray === 'object' && dateArray !== null && dateArray.length >= 6){
          var dateMonth = dateArray[3];
          var dateDay= dateArray[5];
          var dateYear = dateArray[1];        

          if (dateMonth < 1 || dateMonth > 12 || dateDay < 1 || dateDay> 31){
              isValideDate = false;
          } else if((dateMonth===4 || dateMonth===6 || dateMonth===9 || dateMonth===11) && dateDay===31){ 
              isValideDate = false;
          } else if(dateMonth === 2 && (dateDay> 29 || (dateDay ===29 && !(dateYear % 4 === 0 && (dateYear % 100 !== 0 || dateYear % 400 === 0))))) {
              isValideDate = false;
          }        
        } else {
           isValideDate = false;
        } 
      }

      return isValideDate;
  },            
  validateUnique : function(element) { 
    if(element.hasAttribute('data-unique')){
      var xhr = new XMLHttpRequest();
      var eleName = element.getAttribute('name');

      xhr.open("GET", element.getAttribute('data-unique')+"?q="+element.value);

      xhr.addEventListener("load", function() {
        if(this.status !== 200 && validator.scope && validator.scope.hasOwnProperty('errors')){
          validator.scope.errors[eleName] = {
            has     : true,
            message : validator.getErrorMessageByRule('unique').replace(/:attribute/g, validator.ucfirst(eleName))
          };

          
        } else {
          delete validator.scope.errors[eleName];
        }

        if (!validator.scope.$phase){
            validator.scope.$apply()
          }
      }, false);

      xhr.send();
    }

    return true;
  },
  validateMultiCheckbox : function(checkboxElements) {
    var lastCheckboxElement = checkboxElements[checkboxElements.length - 1];
    var eleName             = lastCheckboxElement.getAttribute('data-multicheck-validate');
    var dependendParams     = lastCheckboxElement.hasAttribute('data-dependend-checkbox') ? lastCheckboxElement.getAttribute('data-dependend-checkbox') : false;

    if(dependendParams){
      var params = dependendParams.split(',');
        if(params.length > 1){
          var inputName = params[0],inputValue = params[1];
        }     
        var dependendElement = this.getElement(inputName);

        if(typeof dependendElement === 'object'){
            var dependendValue   = dependendElement.value ? parseInt(dependendElement.value,10) : false;
            
            if(
                typeof dependendValue === 'number'
                && parseInt(dependendElement.value,10) !== parseInt(inputValue,10)
            ){
              return true;
            }
        }
    } 
    
    this.cleanMultiCheckElementErrorMessage(lastCheckboxElement);

    var isChecked = false;
 
    for (let iter = 0; iter < checkboxElements.length; iter++){
      if(checkboxElements[iter].checked === true){
        isChecked = true;
        break;
      }
    }
    if(!isChecked){
       eleName = lastCheckboxElement.getAttribute('data-multicheck-validate');

       this.errors[eleName] = this.getErrorMessageByRule('multlicheck').replace(/:attribute/g, this.ucfirst(eleName));

       this.fillMultiCheckErrorMessageUsingJquery(lastCheckboxElement,false,eleName);
    }
  },       
};

validator.loadLocale();

export default validator;