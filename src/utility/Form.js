import Validator from '../Validator';
import Utility from './Utility';
import toastr from 'toastr';

class Form {
   /**
    * Get instance for utitlity
    *
    * @param object
    * @param object
    * @param callback
    * @param callback
    * @return object
    */
    static getInstance(currentComponent,rules,afterSubmit,afterFileSelect,fileRules) {
        return new Form(currentComponent,rules,afterSubmit,afterFileSelect,fileRules);
    }     
   /**
    * Class initializer
    *
    * @param object
    * @param object
    * @param callback
    * @param callback
    * @return void
    */
    constructor(currentComponent,rules,afterSubmit,afterFileSelect,fileRules) {
        this.currentComponent = currentComponent;

        Validator.setComponent(currentComponent).setRules(rules);

        this.handleFieldsChange = this.handleFieldsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.afterSubmit = afterSubmit;
        this.afterFileSelect = afterFileSelect;
        this.fileRules = fileRules;
    }           
   /**
    * Handle field changes
    *
    * @param object
    * @return void
    */    
    handleFieldsChange(e) {
        let name = e.target.name;

        if(this.currentComponent && name){
          let fields = Object.assign({},this.currentComponent.state.fields);
          fields[name] = e.target.value;


          this.currentComponent.setState({fields: fields});
        }  
    }
   /**
    * Handle field changes from Plugin
    *
    * @param name
    * @param value
    * @return void
    */    
    handleFieldsChangeByPlugin(name,value) {
        if(this.currentComponent && name && value){
          let fields = Object.assign({},this.currentComponent.state.fields);
          fields[name] = value;


          this.currentComponent.setState({fields: fields});
        }  
    }     
   /**
    * Get file rule by element name handleed
    *
    * @param name
    * @return mixed
    */    
    getFileRuleByElementName(name) {
      return (
        Utility.isObject(this.fileRules) 
        && name 
        && this.fileRules.hasOwnProperty(name)
      ) ? this.fileRules[name] : false;
    }    
   /**
    * Handle file select
    *
    * @param object
    * @return void
    */    
    handleFileSelect(e) {
        e.preventDefault();
        let fileList = e.target.files || e.dataTransfer.files;

        if(fileList && fileList.length > 0){
          let file = fileList[0];
          file.fileName = e.target.name;

          this.processFile(file,this.getFileRuleByElementName(e.target.name));
          this.cleanFileElement(e.target);
        }
    }    
   /**
    * Clean the file dom 
    * @return void
    */    
    cleanFileElement(file) {
        try {
         file.value = null;
        } catch (ex) {}

       if(file.value){
         file.parentNode.replaceChild(file.cloneNode(true), file);
       } 
    };    
   /**
    * Process the selected file
    *
    * @param object file
    * @param object rules
    * @return void
    */  
    processFile(file,rules) {
      let errors = this.validateFile(file,rules);

      if(errors.length === 0){
        if(this.isImage(file)){
          this.loadImage(file);
        } 

        if(this.afterFileSelect){
          this.afterFileSelect(file);
        } 
      } else {
        toastr.error(errors.shift(errors),'',{timeOut: 3000});
      }
    } 
   /**
    * Validate the image file selected
    *
    * @param object file
    * @return object
    */      
    validateImageFile(file,rules) {
      let errors = [];

      /**
       * Valid file size selected
       * @rule fileSize 
       */ 
      if(rules.fileSize && file.size > rules.fileSize){
        errors.push(`File size should not be greater than ${(rules.fileSize / (1024 * 1024))} MB`);
      }

      /**
       * Valid selected mime type
       * @rule mime 
       */ 
      if(rules.mime && rules.mime.indexOf(file.type.replace(/image\//g, '')) === -1){
        errors.push('Invalid file uploaded ,Please make sure you select a file with '+rules.mime.join(','));
      }

      return errors;
    };    
   /**
    * Validate the file selected
    *
    * @param object file
    * @return object
    */      
    validateFile(file,rules) {
      let errors = [];

      /**
       * Valid file size selected
       * @rule fileSize 
       */ 
      if(rules.fileSize && file.size > rules.fileSize){
        errors.push(`File size should not be greater than ${(rules.fileSize / (1024 * 1024))} MB`);
      }

      /**
       * Valid selected mime type
       * @rule mime 
       */ 
      if(rules.mime && file.type.length > 0 && rules.mime.indexOf(file.type.substring(file.type.indexOf('/') + 1)) === -1){
        errors.push('Invalid file uploaded ,Please make sure you select a file with '+rules.mime.join(',')+ ' extension');
      }      

      return errors;
    };        
   /**
    * Load selected image file with fileReader
    *
    * @param object file
    * @return void
    */    
    loadImage(file) {
        let reader = new FileReader();

        reader.onload = (e) => {
          file.src = e.target.result;

          if(this.afterFileSelect){
            this.afterFileSelect(file);
          }
        };  

        reader.readAsDataURL(file);
    }; 
   /**
    * Handle form submit
    *
    * @param object
    * @return void
    */    
    handleSubmit(e) {
        e.preventDefault();

        if(Validator.validateReactForm(e.target) && this.afterSubmit){
          this.afterSubmit(this.currentComponent.state.fields);
        }
    }
   /**
    * check selected file is a image
    *
    * @param object file
    * @return boolean
    */  
    isImage(file) {
      return (
        Utility.isObject(file)
        && typeof file.hasOwnProperty('type')
        && ["image/png","image/gif","image/bmp","image/jpg","image/jpeg"].indexOf(file.type) > -1
      );
    }    
}

export default Form;
