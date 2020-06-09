class JSONUtils{

    static extractPrimitiveProperties(metadata,flattenAsString)
    {
        var fldProps = {};

        for (var key in metadata) {
            const prop = metadata[key];
            if(prop == null){
                fldProps[key] = prop;
            }else if(typeof prop != 'object' && typeof prop != 'function' ){
                fldProps[key] = prop;
            }else{
                if(flattenAsString){
                    fldProps[key] = JSON.stringify(prop);
                }
            }
        }
        return fldProps;       
    }
    
}
module.exports = JSONUtils;