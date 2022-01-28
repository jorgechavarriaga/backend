const moment = require('moment');

const isDate = (value)=>{
    if (!value){
        return false;
    }
    const checkIsDate = moment(value);
    if ( checkIsDate.isValid()){
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isDate
}