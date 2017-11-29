import lodashCamelCase from 'lodash.camelcase';

class Utility {
   /**
    * Get element from array by property
    *
    * @param array
    * @param mixed
    * @param string
    * @return mixed
    */
    static getElementFromArrayByProperty(elements,value,property = 'id') {
        let selectedScriptIndex = false;

        let selectedElement = elements.filter((element,index) => {
          let filtered = false;

          if(element[property] === value){
            filtered = true;
            selectedScriptIndex = index;
          }

          return filtered;
        });

        return {element: selectedElement.shift(),index:selectedScriptIndex};
    } 
   /**
    * delete element from array by property value
    *
    * @param array
    * @param mixed
    * @param string
    * @return mixed
    */
    static removeElementFromArrayByProperty(elements,value,property = 'id') {
        return elements.filter((element,index) => {
          return element[property] && element[property] !== value;
        });
    }
   /**
    * Safly push element to array
    *
    * @param elements
    * @param element
    * @param string
    * @return array
    */
    static safelyPushElementToArray(elements,element,property = 'id') {
        let elementInfo = Utility.getElementFromArrayByProperty(elements,element[property]);

        if(!elementInfo.index && Array.isArray(elements)){
            elements.push(element);
        }

        return elements;
    }     
    /**
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    static isObject(value) {
        return value !== null && typeof value === 'object';
    }        
    /**
     *
     * @description
     * Determines if a reference is a `String`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    static isString(value) {
        return typeof value === 'string';
    } 
    /**
     *
     * @description
     * Format the date as {2017-04-03 / 14:58:00}
     *
     * @param date.
     * @returns String
     */
    static getFormattedDate(date) {
        date = new Date(date);
        let prefixAdder = (data) => {return data < 10 ? `0${data}` : data;};  

        return `${date.getFullYear()}-${prefixAdder((date.getMonth() + 1))}-${prefixAdder(date.getDate())} 
                / ${prefixAdder(date.getHours())}:${prefixAdder(date.getMinutes())}:${prefixAdder(date.getSeconds())}`;
    }  

    /**
     *
     * @description
     * Compare two objects
     *
     * @param object1
     * @param object2.
     * @returns boolean
     */
     static equals(o1, o2) {
      if (o1 === o2) return true;
      if (o1 === null || o2 === null) return false;
      // eslint-disable-next-line no-self-compare
      if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
      var t1 = typeof o1, t2 = typeof o2, key, keySet;
      if (t1 === t2 && t1 === 'object') {
        // if (Array.isArray(o1)) {
        //   if (!Array.isArray(o2)) return false;
        //   if ((length = o1.length) === o2.length) {
        //     for (key = 0; key < length; key++) {
        //       if (!Utility.equals(o1[key], o2[key])) return false;
        //     }
        //     return true;
        //   }
        // } else if (isDate(o1)) {
        //   if (!isDate(o2)) return false;
        //   return simpleCompare(o1.getTime(), o2.getTime());
        // } else if (isRegExp(o1)) {
        //   if (!isRegExp(o2)) return false;
        //   return o1.toString() === o2.toString();
        // } else {
          // if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
          //   Array.isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
          keySet = Object.create(null);
          for (key in o1) {
            if (key.charAt(0) === '$' || Utility.isFunction(o1[key])) continue;
            if (!Utility.equals(o1[key], o2[key])) return false;
            keySet[key] = true;
          }
          for (key in o2) {
            if (!(key in keySet) &&
                key.charAt(0) !== '$' &&
                Utility.isDefined(o2[key]) &&
                !Utility.isFunction(o2[key])) return false;
          }
          return true;
        // }
      }
      return false;
    }
    /**
     * Determines if a value is a regular expression object.
     *
     * @private
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    static isRegExp(value) {
      return toString.call(value) === '[object RegExp]';
    }
    /**
     * @description
     * Determines if a value is a date.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Date`.
     */
    static isDate(value) {
      return toString.call(value) === '[object Date]';
    }                  
    /**
     * @description
     * Determines if a reference is a `Function`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    static isFunction(value) {
        return typeof value === 'function';
    }
    /**
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    static isDefined(value) {
        return typeof value !== 'undefined';
    } 
    /**
     * @description
     * Check current browser is ie
     *
     * @returns {boolean} True if `value` is defined.
     */
    static isIE() {
        return /*@cc_on!@*/false || !!document.documentMode;
    } 
    /**
     * @description
     * Check current browser is Edge
     *
     * @returns {boolean} True if `value` is defined.
     */
    static isEdge() {
        return !Utility.isIE() && !!window.StyleMedia;
    } 

    /**
     * @description
     * Get image as base 64
     *
     * @param image
     * @param ext
     * @returns string
     */
    static getImageAsBase64(image,ext) {
        return `data:image/${ext};base64,${image}`;
    } 
    /**
     * @description
     * Get string as camel case
     *
     * @param string
     * @returns string
     */
    static camelCase(str) {
        let convertedStr = lodashCamelCase(str);
        return convertedStr.charAt(0).toUpperCase() + convertedStr.slice(1);
    }                
}

export default Utility;
