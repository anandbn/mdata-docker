const AllObjectsPlugin = require('./AllObjectsPlugin.js');
const classes = { AllObjectsPlugin };
const fs = require('fs');
const path = require('path');
const AbtractPlugin = require('./AbstractPlugin.js');
const lodash = require('lodash');

module.exports = class PluginFactory {

    constructor() {
        this._registeredTypes = new Map();
        fs.readdirSync(__dirname).forEach(file => {
            if (file.endsWith('Plugin.js') && !(file === 'AbstractPlugin.js')) {
                let clazz = require('./' + file);
                if (!lodash.get(this._registeredTypes, clazz.name)) {
                    console.log('Found plugin '+file);
                    lodash.set(this._registeredTypes, clazz.name, clazz);
                }
            }
        });
    }

    getPlugin(clazzName) {
        let clazz = lodash.get(this._registeredTypes, clazzName);
        if (!clazz) {
            console.error("!!!");
            return null;
        }
        let plugin = new clazz();
        return plugin;
    }
    getAllPlugins() {
        return lodash.reduce(this._registeredTypes, function (result, clazz, key) {
            result[key] = new clazz();
            return result;
        }, {});
    }

}